"use client"

import React, { useCallback, useEffect, useRef, useState } from "react";
import NavBar from "@/components/news_and_posts/NavBar";

import { fetchPosts, PostDto } from "@/services/postService";
import { PostNoImageCard } from "@/components/news_and_posts/PostNoImageCard";
import { getUser } from "@/services/authenticationService";

export default function Home() {
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver>();

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
        const tagNames = currentUser.tags.map(tag => tag.name);
        const newPosts = await fetchPosts({pageNumber: page, pageSize: 100, postTags: tagNames});
        
          setPosts(newPosts.items);
         // console.log(newPosts.items[0].userDto.username);
      
      } catch (error) {
        console.error("Error loading posts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [page]);
  
  return (
    <>
    <NavBar />
    <br />
      <div className="max-w-3xl mx-auto mb-12">
      {loading  && (
            <div className="col-span-full flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          )}
        {posts.map((post, index) => (
         
        
          <PostNoImageCard
            key={post.id}
            avatarUrl={"https://miamistonesource.com/wp-content/uploads/2018/05/no-avatar-25359d55aa3c93ab3466622fd2ce712d1.jpg"}
            avatarFallback={post.userDto.username}
            username={post.userDto.username}
            date={post.createdAt}
            title={post.title}
            content={post.content}
            categories={post.tags.map(tag => tag.name)}
            likes={post.likes}
            comments={post.comments? post.comments.length : 0}
          />
          
        ))}
      
      </div>
    </>
  );
}
