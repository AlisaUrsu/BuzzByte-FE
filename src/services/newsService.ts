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
  
  interface NewsApiResponse {
    status: string;
    totalResults: number;
    articles: NewsApiArticle[];
  }
  
  export const fetchNews = async (): Promise<NewsCardProps[]> => {
    const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
    // Modified URL to include technology category
    const API_URL = `https://newsapi.org/v2/top-headlines?category=technology&apiKey=${API_KEY}`;
  
    try {
      const response = await fetch(API_URL);
      const data: NewsApiResponse = await response.json();
  
      return data.articles.map(article => ({
        avatarUrl: "https://via.placeholder.com/40",
        avatarFallback: article.source.name[0],
        userName: article.source.name,
        date: new Date(article.publishedAt).toLocaleDateString(),
        title: article.title,
        description: article.description || "",
        imageUrl: article.urlToImage || "",
        urlToImage: article.urlToImage || "",
        // Added tech-specific categories
        categories: ["Tech", "Technology", article.source.name], 
        likes: 0, 
        comments: 0, 
      }));
    } catch (error) {
      console.error("Error fetching news:", error);
      return [];
    }
  };