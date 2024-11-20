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
  
  export const fetchNews = async (page: number = 1): Promise<NewsCardProps[]> => {
    const API_KEY = "e63ed8d23a244e6c9485f32b009f7397";
    const pageSize = 10;
    const API_URL = `https://newsapi.org/v2/top-headlines?category=technology&pageSize=${pageSize}&page=${page}&apiKey=${API_KEY}`;
  
    try {
      const response = await fetch(API_URL);
      const data: NewsApiResponse = await response.json();

      if (data.status !== "ok") {
        throw new Error("Failed to fetch news");
      }
  
      return data.articles.map(article => ({
        avatarUrl: "https://avatar.iran.liara.run/public",
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
      }));
    } catch (error) {
      console.error("Error fetching news:", error);
      return [];
    }
  };