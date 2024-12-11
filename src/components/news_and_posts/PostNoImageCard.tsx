import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "../ui/button";
import { Bookmark, Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { description } from "../login/login-form";
import { Badge } from "../ui/badge";
import { DateDisplay } from "@/app/utils/FormatDate";

export type PostNoImageCardProps = {
    avatarUrl: string;
    avatarFallback: string;
    username: string;
    createdAt: string;
    title: string;
    content: string;
    categories: string[];
    likes: number;
    comments: number;
    updatedAt: string;
  };
export function PostNoImageCard({
    avatarUrl,
    avatarFallback,
    username,
    createdAt,
    title,
    content,
    categories,
    likes,
    comments,
    updatedAt
  }: PostNoImageCardProps) {
    const [liked, setLiked] = useState(false);
    const [commented, setCommented] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const profileImageUrl = `data:image/jpeg;base64,${avatarUrl}`;

    const isEdited = createdAt !== updatedAt;
  
    return (
        <Card className="shadow-md border rounded-lg mt-2">
            <CardHeader className="-mb-3">
                <div  className="flex items-center justify-between ">
    
                <div className="flex items-center space-x-2">
                    <Avatar className="w-7 h-7 rounded-full">
                    <AvatarImage className="w-7 h-7 rounded-full" src={profileImageUrl} />
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{username}</span>
                    <div className="text-xs text-muted-foreground"><DateDisplay dateString={createdAt}></DateDisplay></div>
                    {isEdited && (
                      <span className="text-xs text-muted-foreground">(Edited)</span>
                    )}
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <button className="p-1">
                        <MoreHorizontal className="h-5 w-5 cursor-pointer" />
                    </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    <DropdownMenuItem>Hide</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Share</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                </div>
            </CardHeader>

        <CardContent>
          <CardTitle className="font-bold text-lg">{title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground line-clamp-3 ">
            {content}
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
                className={`flex items-center space-x-1 cursor-pointer ${liked ? "text-red-500" : ""
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
                className="flex items-center space-x-1 cursor-pointer"
              >
                <MessageCircle className="h-5 w-5" />
                <span>{comments}</span>
              </div>
            </div>

            <div
              className={`cursor-pointer ${bookmarked ? "text-yellow-500" : ""
                }`}
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
    )
  }