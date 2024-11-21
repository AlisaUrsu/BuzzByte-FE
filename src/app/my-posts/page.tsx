"use client"

import React, { useCallback, useEffect, useRef, useState } from "react";
import NavBar from "@/components/news_and_posts/NavBar";

import { fetchPosts, PostDto, deletePost } from "@/services/postService";
import { PostNoImageCard } from "@/components/news_and_posts/PostNoImageCard";
import { MyPostNoImageCard } from "@/components/news_and_posts/MyPostNoImageCard";
import { Button } from "@/components/ui/button";

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
        const newPosts = await fetchPosts({pageNumber: page, pageSize: 10, postAuthor: "buzz_dev"});
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
          <Button className="mt-4">Create Post</Button>
        </div>
      </div>) :
        (posts.map((post) => (
          
          <MyPostNoImageCard
            key={post.id}
            postId={post.id.toString()}
            avatarUrl={"https://miamistonesource.com/wp-content/uploads/2018/05/no-avatar-25359d55aa3c93ab3466622fd2ce712d1.jpg"}
            avatarFallback={post.userDto.username}
            username={post.userDto.username}
            date={post.createdAt}
            title={post.title}
            content={post.content}
            categories={post.tags.map(tag => tag.name)}
            likes={post.likes}
            comments={post.comments? post.comments.length : 0}
            onDelete={handleDeletePost}
          />
        )))}
      </div>
    </>
  );
}
