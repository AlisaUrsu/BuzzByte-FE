"use client";

import { MyPostCard } from "@/components/news_and_posts/MyPostCard";
import NavBar from "@/components/news_and_posts/NavBar";
import { PostCard } from "@/components/news_and_posts/PostCard";
import { PostNoImageCard, PostNoImageCardProps } from "@/components/news_and_posts/PostNoImageCard";
import { getUser } from "@/services/authenticationService";
import { fetchBookmarkedPosts, PostDto } from "@/services/postService";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const Bookmarks: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<PostDto[]>([]);

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const user = await getUser();
        const userId = user.id; 
        const bookmarkedPosts = await fetchBookmarkedPosts(userId);
        setBookmarks(bookmarkedPosts);
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
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {bookmarks.map((bookmark) => (
          <Link key={bookmark.id} href={`/posts/${bookmark.id}`} passHref className="block hover:shadow-lg transition">
          {bookmark.image && bookmark.image.trim() !== "" ? (
          <PostCard
          key={bookmark.id}
          postId={bookmark.id}
          avatarUrl={bookmark.userDto.profilePicture}
          avatarFallback={bookmark.userDto.username}
          username={bookmark.userDto.username}
          createdAt={bookmark.createdAt}
          title={bookmark.title}
          image={bookmark.image}
          content={bookmark.content}
          categories={bookmark.tags.map(tag => tag.name)}
          likes={bookmark.likes}
          comments={bookmark.comments? bookmark.comments.length : 0}
          updatedAt={bookmark.updatedAt}
          
        />
          ) :
          (
          <PostNoImageCard
              key={bookmark.id}
              postId={bookmark.id}
              avatarUrl={bookmark.userDto.profilePicture}
              avatarFallback={bookmark.userDto.username}
              username={bookmark.userDto.username}
              createdAt={bookmark.createdAt}
              title={bookmark.title}
              content={bookmark.content}
              categories={bookmark.tags.map(tag => tag.name)}
              likes={bookmark.likes}
              comments={bookmark.comments? bookmark.comments.length : 0}
              updatedAt={bookmark.updatedAt}
          
            />
          )
        }
          </Link>
        ))}
        </div>
      </div>
    </>
  );
};

export default Bookmarks;