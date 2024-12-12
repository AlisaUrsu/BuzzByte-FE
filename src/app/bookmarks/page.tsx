"use client";

import NavBar from "@/components/news_and_posts/NavBar";
import { PostNoImageCard, PostNoImageCardProps } from "@/components/news_and_posts/PostNoImageCard";
import { getUser } from "@/services/authenticationService";
import { fetchBookmarkedPosts } from "@/services/postService";
import React, { useState, useEffect } from "react";

const Bookmarks: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<PostNoImageCardProps[]>([]);

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const user = await getUser(); // Get the user object
        const userId = user.id; // Extract the user ID
        const bookmarkedPosts = await fetchBookmarkedPosts(userId);
        const formattedBookmarks = bookmarkedPosts.map(post => ({
          avatarUrl: post.userDto.profilePicture,
          avatarFallback: post.userDto.username[0],
          username: post.userDto.username,
          createdAt: post.createdAt,
          title: post.title,
          content: post.content,
          categories: post.tags.map(tag => tag.name),
          likes: post.likes,
          comments: post.comments ? post.comments.length : 0,
          updatedAt: post.updatedAt,
          postId: post.id,
        }));
        setBookmarks(formattedBookmarks);
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    };

    loadBookmarks();
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
              createdAt={bookmark.createdAt}
              title={bookmark.title}
              content={bookmark.content}
              categories={bookmark.categories}
              likes={bookmark.likes}
              comments={bookmark.comments}
              updatedAt={bookmark.updatedAt}
              postId={bookmark.postId}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Bookmarks;