"use client"
import React, { useEffect, useRef, useState, useCallback } from "react";
import NavBar from "../components/news_and_posts/NavBar";
import { NewsCard, NewsCardProps } from "../components/news_and_posts/NewsCard";
import { RouteGuard } from "@/components/login/route-guard";
import { fetchNews } from "@/services/newsService";

export default function Home() {
  const [news, setNews] = useState<NewsCardProps[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver>();

  const lastNewsElementRef = useCallback((node: HTMLDivElement) => {
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
    const loadNews = async () => {
      setLoading(true);
      try {
        const newNews = await fetchNews(page);
        if (newNews.length === 0) {
          setHasMore(false);
        } else {
          setNews(prev => [...prev, ...newNews]);
        }
      } catch (error) {
        console.error("Error loading news:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [page]);

  return (
    <>
      <NavBar />
      <br />
      <RouteGuard>
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
          {news.map((newsItem, index) => (
            <div
              key={index}
              ref={index === news.length - 1 ? lastNewsElementRef : null}
            >
              <NewsCard
                avatarUrl={newsItem.avatarUrl}
                avatarFallback={newsItem.avatarFallback}
                userName={newsItem.userName}
                date={newsItem.date}
                title={newsItem.title}
                description={newsItem.description}
                imageUrl={newsItem.imageUrl}
                urlToImage={newsItem.imageUrl}
                sourceUrl={newsItem.sourceUrl}
                categories={newsItem.categories}
                likes={newsItem.likes}
                comments={newsItem.comments}
              />
            </div>
          ))}
          {loading && (
            <div className="col-span-full flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          )}
        </div>
      </RouteGuard>

    </>
  );
}