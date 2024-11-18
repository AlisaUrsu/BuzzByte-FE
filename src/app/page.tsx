"use client"
import Image from "next/image";
import React from "react";
import NavBar from "../components/news_and_posts/NavBar";

//import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { NewsCard } from "./NewsCard";
import { useAuthRedirect } from "@/hooks/use-auth";
import { RouteGuard } from "@/components/login/route-guard";


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
      "The effects of climate change continue to impact ecosystems worldwide...",
    imageUrl: "https://i.pinimg.com/control/564x/c6/b5/8a/c6b58a94473720d038dc599de24dcbfb.jpg",
    categories: ["Environment", "Climate"],
    likes: 200,
    comments: 30,
  },
];

export default function Home() {
  //useAuthRedirect(); //use this is routeguard doesnt work

  const [date, setDate] = React.useState<Date | undefined>(new Date())
  return (
    <>
      <NavBar />
      <br />
      <RouteGuard>
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
          {newsList.map((newsItem, index) => (
            <NewsCard
              key={index}
              avatarUrl={newsItem.avatarUrl}
              avatarFallback={newsItem.avatarFallback}
              userName={newsItem.userName}
              date={newsItem.date}
              title={newsItem.title}
              description={newsItem.description}
              imageUrl={newsItem.imageUrl}
              categories={newsItem.categories}
              likes={newsItem.likes}
              comments={newsItem.comments}
            />
          ))}
        </div>
      </RouteGuard>
    </>
  );
}
