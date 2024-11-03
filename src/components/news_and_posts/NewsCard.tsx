import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Select, SelectTrigger, SelectContent, SelectItem } from "../ui/select"
import { MoreHorizontal, Heart, MessageCircle, Bookmark } from "lucide-react";
import { useState } from "react";


type NewsCardProps = {
  avatarUrl: string;
  avatarFallback: string;
  userName: string;
  date: string;
  title: string;
  description: string;
  imageUrl: string;
  categories: string[];
  likes: number;
  comments: number;
};

import { NewsModal } from "./NewsModal";

export function NewsCard({
  avatarUrl,
  avatarFallback,
  userName,
  date,
  title,
  description,
  imageUrl,
  categories,
  likes,
  comments,
}: NewsCardProps) {
  const [liked, setLiked] = useState(false);
  const [commented, setCommented] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <>
      <Card
        className="max-w-lg shadow-md border relative cursor-pointer"
        onClick={toggleModal} 
      >
        <CardHeader className="p-4 flex items-center justify-between">
          <div className="absolute top-2 left-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatarUrl} alt="avatar" />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
          </div>
          <div className="text-xs text-center w-full text-muted-foreground font-semibold">
            {date}
          </div>
          <div className="absolute top-2 right-2">
            <Select>
              <SelectTrigger className="p-2">
                <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
              </SelectTrigger>
              <SelectContent className="w-32">
                <SelectItem value="share">Share</SelectItem>
                <SelectItem value="hide">Hide</SelectItem>
                <SelectItem value="bookmark">Bookmark</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        {imageUrl && (
          <img
            src={imageUrl}
            alt="News"
            className="w-full h-48 object-cover rounded-md mb-4"
          />
        )}

        <CardContent>
          <CardTitle className="font-bold text-lg">{title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground line-clamp-3 mt-2">
            {description}
          </CardDescription>

          <div className="mt-3 flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-gray-200"
                onClick={() => console.log(`Clicked category: ${category}`)}
              >
                {category}
              </Badge>
            ))}
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="flex space-x-4 items-center text-muted-foreground">
              <div
                className={`flex items-center space-x-1 cursor-pointer ${
                  liked ? "text-red-500" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setLiked(!liked);
                }}
              >
                <Heart className="h-5 w-5" />
                <span>{likes + (liked ? 1 : 0)}</span>
              </div>

              <div
                className={`flex items-center space-x-1 cursor-pointer ${
                  commented ? "text-blue-500" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCommented(!commented);
                }}
              >
                <MessageCircle className="h-5 w-5" />
                <span>{comments + (commented ? 1 : 0)}</span>
              </div>
            </div>

            <div
              className={`cursor-pointer ${bookmarked ? "text-yellow-500" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setBookmarked(!bookmarked);
              }}
            >
              <Bookmark className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>

      <NewsModal
         isOpen={isModalOpen}
         onClose={toggleModal}
         avatarUrl={avatarUrl}
         avatarFallback={avatarFallback}
         userName={userName}
         date={date}
         title={title}
         description={description}
         imageUrl={imageUrl}
         categories={categories}
         
      />
    </>
  );
}
