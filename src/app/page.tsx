"use client"
import React, { useEffect, useRef, useState, useCallback } from "react";
import NavBar from "../components/news_and_posts/NavBar";
import { NewsCard, NewsCardProps } from "../components/news_and_posts/NewsCard";
import { RouteGuard } from "@/components/login/route-guard";
import { fetchNews } from "@/services/newsService";
import NewsFiltering from "@/components/news_and_posts/NewsFiltering";
interface FilterParams {
  categories?: string[];
  dateRange?: { from: Date; to: Date };
  keyword?: string;
  source?: string;
  author?: string;
}

export default function Home() {
  const [news, setNews] = useState<NewsCardProps[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver>();
  const [hiddenUrls, setHiddenUrls] = useState<Set<string>>(new Set());

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [keyword, setKeyword] = useState("");
  const [selectedSource, setSelectedSource] = useState("");

  const allCategories = Array.from(new Set(news.flatMap(item => item.categories)));
  const allSources = Array.from(new Set(news.map(item => item.userName)));


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
        const newNews = await fetchNews(page, {
          categories: selectedCategories,
          keyword,
          source: selectedSource
        });
        if (newNews.length === 0) {
          setHasMore(false);
        } else {
          setNews(prev => {
            const uniqueNews = new Map(prev.map(item => [item.sourceUrl, item]));
            newNews.forEach(item => uniqueNews.set(item.sourceUrl, item));
            return Array.from(uniqueNews.values());
          });
        }
      } catch (error) {
        console.error("Error loading news:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [page, selectedCategories, keyword, selectedSource]);


  const hideNews = useCallback((sourceUrl: string) => {
    setHiddenUrls(prev => new Set([...prev, sourceUrl]));
    setNews(prevNews => prevNews.filter(item => item.sourceUrl !== sourceUrl));
  }, []);

  const handleFilterChange = (filters: FilterParams) => {
    // Reset the news list and paging
    setPage(1);
    setHasMore(true);
    setNews([]);
  
    setSelectedCategories(filters.categories || []);
    setKeyword(filters.keyword || "");
    setSelectedSource(filters.source || "");
  };

  return (
    <>
      <NavBar />
      <br />
      <RouteGuard>
        <NewsFiltering
          allCategories={["Tech", "AI", "Innovation"]} // Provide actual categories
          allSources={["TechCrunch", "BBC News"]} // Provide actual sources
          onFilterChange={handleFilterChange}
        />
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 ml-6 mr-6">
          {news
            .filter(newsItem => !hiddenUrls.has(newsItem.sourceUrl))
            .map((newsItem, index) => (
              <div
                key={newsItem.sourceUrl}
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
                  onHide={hideNews}
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