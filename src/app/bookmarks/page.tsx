import NavBar from "@/components/news_and_posts/NavBar";
import { NewsCard, NewsCardProps } from "@/components/news_and_posts/NewsCard";
import React, { useState, useEffect } from "react";

const Bookmarks: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<NewsCardProps[]>([]);

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
            <NewsCard
              key={index}
              avatarUrl={bookmark.avatarUrl}
              avatarFallback={bookmark.avatarFallback}
              userName={bookmark.userName}
              date={bookmark.date}
              title={bookmark.title}
              description={bookmark.description}
              imageUrl={bookmark.imageUrl}
              urlToImage={bookmark.urlToImage}
              sourceUrl={bookmark.sourceUrl}
              categories={bookmark.categories}
              onHide={() => {}}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Bookmarks;