"use client"

import {useState,useEffect} from "react";
//import { Calendar } from "@/components/ui/calendar"


import { NewsCard, NewsCardProps } from "../../components/news_and_posts/NewsCard";



const newsList = [
  {
    avatarUrl: "https://i.pinimg.com/736x/d0/31/64/d03164b012f9a7ac5683ba646357eb72.jpg",
    avatarFallback: "A1",
    userName: "TechCrunch",
    date: "October 23, 2024",
    title: "New AI Breakthrough in 2024",
    description:
      "Scientists have made significant advancements in AI technology...",
    imageUrl: "https://i.pinimg.com/control/564x/bd/f6/08/bdf60812293828f6b675f7a6711c8448.jpg",
    categories: ["AI", "Tech", "Innovation"],
    likes: 120,
    comments: 15,
  },
  {
    avatarUrl: "https://i.pinimg.com/control/564x/4e/78/2f/4e782fbe73a6f573160c61b183a16971.jpg",
    avatarFallback: "A2",
    userName: "BBC News",
    date: "October 21, 2024",
    title: "Climate Change: A Global Issue",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error atque aliquam, eligendi neque nesciunt, et rem recusandae culpa aspernatur ipsa repudiandae perferendis quia officiis ducimus ex incidunt excepturi debitis nemo?",
    imageUrl: "https://i.pinimg.com/control/564x/c6/b5/8a/c6b58a94473720d038dc599de24dcbfb.jpg",
    categories: ["Environment", "Climate"],
    likes: 200,
    comments: 30,
  },
];




export default function Home() {

  //TBD insert some tags for news api  
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [newsList, setNewsList] = useState<NewsCardProps[]>([]);
  const [tags, setTags] = useState(["AI", "Tech"]);
  const fetchNewsForTag = async (tag: string, articlesPerTag:number) => {
    try {
      const response = await fetch(`https://newsapi.org/v2/everything?q=${tag}&pageSize=${articlesPerTag}&apiKey=02e8510d2a9e4f7c980a8d48d379464e`);
      const data = await response.json();
      return data.articles.filter(article => article.urlToImage).map(article => ({
        ...article,
        categories: [tag],
        likes: 0,
        comments: 0,
      }));
    } catch (error) {
      console.error(`Error fetching news for tag ${tag}:`, error);
      return []; 
    }
  };

  const fetchAllNews = async () => {
    //setLoading(true);
    try {
      const allArticlesPromises = tags.map(tag => fetchNewsForTag(tag,10));
      const allArticlesArrays = await Promise.all(allArticlesPromises);
      const combinedArticles = allArticlesArrays.flat(); 
      const shufledArticles = combinedArticles.sort(() => 0.5 - Math.random());
      setNewsList(shufledArticles);
    } catch (error) {
      console.error("Error fetching all news:", error);
    } finally {
      //setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNews();
  }, []);

  return (
    <>
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        {newsList.map((newsItem, index) => (
          <NewsCard
            key={index}
            avatarUrl={"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.flaticon.com%2Ffree-icon%2Fcute_260185&psig=AOvVaw3ivSdPaeQZ_3MNDnGiyUG6&ust=1730831632559000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCIDqhreow4kDFQAAAAAdAAAAABAE"}
            avatarFallback={newsItem.avatarFallback}
            userName={newsItem.userName}
            date={newsItem.date}
            title={newsItem.title}
            description={newsItem.description}
            urlToImage={newsItem.urlToImage}
            // categories={newsItem.categories}
            categories={newsItem.categories}
            likes={0}  //TBD: ask people what to do when it comes to likes and comments.... cause i dont know if i store the news in database 
            comments={0}
          />
        ))}
      </div>
    </>
  );
}
