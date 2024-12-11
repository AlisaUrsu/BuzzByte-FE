import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "../ui/button";
import { Bookmark, Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { description } from "../login/login-form";
import { Badge } from "../ui/badge";
import { DateDisplay } from "@/app/utils/FormatDate";
import { useRouter } from "next/navigation";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { deletePost } from "@/services/postService";

export type PostNoImageCardProps = {
    postId: string;
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
    onDelete: (postId: number) => void;
  };
export function MyPostNoImageCard({
    postId,
    avatarUrl,
    avatarFallback,
    username,
    createdAt,
    title,
    content,
    categories,
    likes,
    comments,
    updatedAt,
    onDelete
  }: PostNoImageCardProps) {
    const [liked, setLiked] = useState(false);
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const profileImageUrl = `data:image/jpeg;base64,${avatarUrl}`;
    const handleUpdateClick = () => {
        router.push(`/update/${postId}`);
    }

    const handleDeleteClick = async () => {
        await deletePost(Number(postId));
        onDelete(Number(postId));
      };

      const isEdited = createdAt !== updatedAt;
  
    return (
        <><Card className="shadow-md border rounded-lg mt-2">
        <CardHeader className="-mb-3">
          <div className="flex items-center justify-between ">

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
            <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1">
                  <MoreHorizontal className="h-5 w-5 cursor-pointer" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleUpdateClick} className="cursor-pointer">Update</DropdownMenuItem>
                <DropdownMenuSeparator />

                <AlertDialogTrigger asChild>

                  <DropdownMenuItem className="text-red-500 cursor-pointer">Delete</DropdownMenuItem>
                </AlertDialogTrigger>


              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Post</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this post? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-red-500" onClick={handleDeleteClick}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
        </div>
      </CardHeader><CardContent>
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
                className={`flex items-center space-x-1 cursor-pointer ${liked ? "text-red-500" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setLiked(!liked);
                } }
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

          </div>
        </CardContent>
        
        </Card>
        </>
    )
  }