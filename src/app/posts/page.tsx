"use client"

import React, { useCallback, useEffect, useRef, useState } from "react";
import NavBar from "@/components/news_and_posts/NavBar";

import { fetchPosts, fetchTags, PostDto } from "@/services/postService";
import { PostNoImageCard } from "@/components/news_and_posts/PostNoImageCard";
import { addTagsToUser, getUser } from "@/services/authenticationService";
import FilterModal from "@/components/form/FilterModal";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Icon } from "@radix-ui/react-select";
import TagsSelector from "@/components/form/TagsSelector";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PostCard } from "@/components/news_and_posts/PostCard";


export default function Home() {
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver>();
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [newTags, setNewTags] = useState<string[]>([]);

  const lastPostsElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const handleFilters = (
    newTags: string[] | null,
    newStartDate: string | null,
    newEndDate: string | null,
    newTitle: string | null,
    newContent: string | null
  ) => {
    setTags(newTags || []);
    setStartDate(newStartDate || "");
    setEndDate(newEndDate || "");
    setTitle(newTitle || "");
    setContent(newContent || "");

    // Update query parameters in the URL
    const params = new URLSearchParams();
    if (newTags && newTags.length > 0) params.set("tags", newTags.join(","));
    if (newStartDate) params.set("startDate", newStartDate);
    if (newEndDate) params.set("endDate", newEndDate);
    if (newTitle) params.set("title", newTitle);
    if (newContent) params.set("content", newContent);
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    setTags([]);
    setStartDate("");
    setEndDate("");
    setTitle("");
    setContent("");
    setPage(0);

    // Clear query parameters in the URL
    router.push("?");
  };

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        let newPosts;
        if (tags.length == 0){
          const currentUser = await getUser();
          const tagNames = currentUser.tags.map(tag => tag.name);
          newPosts = await fetchPosts ({pageNumber: page, pageSize: 100, postTags: tagNames});
        } else if (newTags.length > 0) {
          newPosts = await fetchPosts ({pageNumber: page, pageSize: 100, postTags: newTags});
        }
        
        else {
          newPosts = await fetchPosts({pageNumber: page, pageSize: 100, postTags: tags, postTitle: title, postContent: content, startDate: startDate, endDate: endDate});
        }
        setPosts(newPosts.items);
         // console.log(newPosts.items[0].userDto.username);
      
      } catch (error) {
        console.error("Error loading posts:", error);
      } finally {
        setLoading(false);
      }
    };
    async function loadTags() {
      try {
        const tagsDto = await fetchTags({ pageNumber: 0, pageSize: 100 });
        const currentUser = await getUser();  // Get the current user
        // Get the tags the user already has
        const userTags = currentUser.tags.map(tag => tag.name);
        const tags = tagsDto.items.map((tag) => tag.name)
        console.log(userTags);
        // Filter the available tags to remove the user's tags
        const filteredTags = tags.filter(tag => !userTags.includes(tag));
        setAvailableTags(filteredTags.map((tag) => tag));
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    }
    loadTags();
    loadPosts();
  }, [page, tags, title, content, startDate, endDate]);

  async function handleNewTags() {
    console.log(newTags);
    const currentUser = await getUser();
    const userTags = currentUser.tags.map(tag => tag.name);
    await addTagsToUser(currentUser.id, [...userTags, ...newTags]);
    setPage(0);
  }

  

  return (
    <>
    <NavBar />
    <br />
      <div className="max-w-3xl mx-auto mb-12" suppressHydrationWarning={true}>
      <div className="flex justify-between mb-4  gap-3">
      <Popover>
        <PopoverTrigger asChild>
          <Button>Follow new tags</Button>
        </PopoverTrigger>
        
        <PopoverContent className="text-sm text-muted-foreground">
        Let’s super-charge your feed with relevant content! Start by choosing tags you want to follow, and we will curate your feed accordingly.
        <TagsSelector selectedTags={newTags} setSelectedTags={setNewTags} availableTags={availableTags}/>
        <div className="text-xs mb-2">Refresh the page to see updates.</div>
        <Button onClick={handleNewTags}>Save tags</Button>
        </PopoverContent>
      </Popover>
      <div className="flex justify-end   gap-3">
          {/* Trigger Filter Modal */}
          {(tags.length > 0 || title || content || startDate || endDate) && (
            <><Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button></>)}
            <FilterModal onSubmit={handleFilters} />
        </div>
        </div>
      {loading  && (
            <div className="col-span-full flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          )}
          
        {posts.map((post, index) => (
          <Link key={post.id} href={`/posts/${post.id}`} passHref className="block hover:shadow-lg transition">
          {post.image && post.image.trim() !== "" ? (
            <PostCard
              key={post.id}
              postId={post.id}
              avatarUrl={post.userDto.profilePicture}
              avatarFallback={post.userDto.username}
              username={post.userDto.username}
              createdAt={post.createdAt}
              title={post.title}
              content={post.content}
              image={post.image} // Include the image here
              categories={post.tags.map(tag => tag.name)}
              likes={post.likes}
              comments={post.comments ? post.comments.length : 0}
              updatedAt={post.updatedAt}
            />
          ) : (
            <PostNoImageCard
              key={post.id}
              postId={post.id}
              avatarUrl={post.userDto.profilePicture}
              avatarFallback={post.userDto.username}
              username={post.userDto.username}
              createdAt={post.createdAt}
              title={post.title}
              content={post.content}
              categories={post.tags.map(tag => tag.name)}
              likes={post.likes}
              comments={post.comments ? post.comments.length : 0}
              updatedAt={post.updatedAt}
            />
          )}

          
          </Link>
        ))}
      
      </div>
    </>
  );
}
