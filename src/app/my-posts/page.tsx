"use client"

import React, { useCallback, useEffect, useRef, useState } from "react";
import NavBar from "@/components/news_and_posts/NavBar";

import { fetchPosts, PostDto, deletePost } from "@/services/postService";
import { PostNoImageCard } from "@/components/news_and_posts/PostNoImageCard";
import { MyPostNoImageCard } from "@/components/news_and_posts/MyPostNoImageCard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getUser } from "@/services/authenticationService";

export default function Home() {
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver>();
  const router = useRouter();

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

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const currentUser = await getUser();
        const newPosts = await fetchPosts({pageNumber: page, pageSize: 10, postAuthor: currentUser.username});
        setPosts(newPosts.items);
      } catch (error) {
        console.error("Error loading posts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [page]);

  const handleDeletePost = (postId: number) => {
    setPosts(posts => posts.filter(post => post.id !== postId));
  };

  const handleNewPostClick = () => {
    router.push("/add");
};
  
  return (
    <>
    <NavBar />
    <br />
      <div className="max-w-3xl mx-auto">
        {posts.length === 0 ? (
        <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            You have no posts publicated
          </h3>
          <p className="text-sm text-muted-foreground">
            You can start sharing content by creating your first post.
          </p>
          <Button className="mt-4" onClick={handleNewPostClick}>Create Post</Button>
        </div>
      </div>) :
        (posts.map((post) => (
          
          <MyPostNoImageCard
            key={post.id}
            postId={post.id.toString()}
            avatarUrl={post.userDto.profilePicture}
            avatarFallback={post.userDto.username}
            username={post.userDto.username}
            createdAt={post.createdAt}
            title={post.title}
            content={post.content}
            categories={post.tags.map(tag => tag.name)}
            likes={post.likes}
            comments={post.comments? post.comments.length : 0}
            updatedAt={post.updatedAt}
            onDelete={handleDeletePost}
          />
        )))}
        
      </div>
    </>
  );
}
