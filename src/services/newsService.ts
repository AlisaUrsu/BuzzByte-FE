import { NewsCardProps } from "@/components/news_and_posts/NewsCard";

export interface NewsApiArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

interface FilterParams {
  categories?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  keyword?: string;
  source?: string;
  author?: string;
}

interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
}

const newsCache: { [key: string]: NewsCardProps[] } = {};

export const fetchNews = async (
  page: number = 1,
  filters?: FilterParams
): Promise<NewsCardProps[]> => {
  // Create cache key that includes filters
  const cacheKey = `${page}-${JSON.stringify(filters)}`;
  if (newsCache[cacheKey]) {
    return newsCache[cacheKey];
  }

  const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
  const pageSize = 8;
  
  // Build query parameters
  const queryParams = new URLSearchParams({
    category: 'technology',
    pageSize: pageSize.toString(),
    page: page.toString(),
    apiKey: API_KEY || ''
  });

  // Add filter parameters
  if (filters) {
    if (filters.keyword) {
      queryParams.append('q', filters.keyword);
    }
    if (filters.source) {
      queryParams.append('sources', filters.source);
    }
    if (filters.dateFrom) {
      queryParams.append('from', filters.dateFrom.toISOString());
    }
    if (filters.dateTo) {
      queryParams.append('to', filters.dateTo.toISOString());
    }
  }

  const API_URL = `https://newsapi.org/v2/top-headlines?${queryParams.toString()}`;

  try {
    const response = await fetch(API_URL);
    const data: NewsApiResponse = await response.json();

    if (data.status !== "ok") {
      throw new Error("Failed to fetch news");
    }

    const articlesWithImages = data.articles.filter(article => article.urlToImage);

    const uniqueUrls = new Set<string>();
    const uniqueArticles = articlesWithImages.filter(article => {
      // Apply additional client-side filters
      if (uniqueUrls.has(article.url)) return false;
      
      const matchesCategories = !filters?.categories?.length || 
        filters.categories.some(cat => article.source.name.includes(cat));
      
      const matchesAuthor = !filters?.author || 
        article.author?.includes(filters.author);

      if (matchesCategories && matchesAuthor) {
        uniqueUrls.add(article.url);
        return true;
      }
      return false;
    });

    const newsData = uniqueArticles.map(article => ({
      avatarUrl: "",
      avatarFallback: article.source.name[0],
      userName: article.source.name,
      date: new Date(article.publishedAt).toLocaleDateString(),
      title: article.title,
      description: article.description || "",
      imageUrl: article.urlToImage || "",
      urlToImage: article.urlToImage || "",
      sourceUrl: article.url,
      categories: ["Technology", article.source.name],
      likes: 0,
      comments: 0,
      onHide: () => {}, // Add a default onHide function
    }));

    newsCache[cacheKey] = newsData;
    return newsData;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};