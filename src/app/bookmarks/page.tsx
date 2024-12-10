"use client";

import NavBar from "@/components/news_and_posts/NavBar";
import { PostNoImageCard, PostNoImageCardProps } from "@/components/news_and_posts/PostNoImageCard";
import React, { useState, useEffect } from "react";

const Bookmarks: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<PostNoImageCardProps[]>([
    {
      avatarUrl: "https://example.com/avatar1.jpg",
      avatarFallback: "AB",
      username: "Alice Brown",
      date: "2024-12-01",
      title: "Exciting Tech News",
      content: "Discover the latest advancements in AI and blockchain.",
      categories: ["Technology", "AI"],
      likes: 120,
      comments: 34,
    },
    {
      avatarUrl: "https://example.com/avatar2.jpg",
      avatarFallback: "CD",
      username: "Charlie Davis",
      date: "2024-11-30",
      title: "Top Programming Languages in 2024",
      content: "A comprehensive guide to the most popular languages.",
      categories: ["Programming", "Languages"],
      likes: 200,
      comments: 50,
    },
    {
      avatarUrl: "https://example.com/avatar3.jpg",
      avatarFallback: "EF",
      username: "Eve Frank",
      date: "2024-12-02",
      title: "How Quantum Computing Will Change the Future",
      content: "Explore the potential of quantum computing.",
      categories: ["Quantum Computing", "Innovation"],
      likes: 180,
      comments: 20,
    },
  ]);

  useEffect(() => {
    const storedBookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    if (storedBookmarks.length > 0) {
      setBookmarks(storedBookmarks);
    }
  }, []);

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">My Bookmarks</h1>
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
          {bookmarks.map((bookmark, index) => (
            <PostNoImageCard
              key={index}
              avatarUrl={bookmark.avatarUrl}
              avatarFallback={bookmark.avatarFallback}
              username={bookmark.username}
              date={bookmark.date}
              title={bookmark.title}
              content={bookmark.content}
              categories={bookmark.categories}
              likes={bookmark.likes}
              comments={bookmark.comments}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Bookmarks;
