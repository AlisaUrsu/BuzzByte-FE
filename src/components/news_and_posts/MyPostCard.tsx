import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "../ui/button";
import { Bookmark, Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { description } from "../login/login-form";
import { Badge } from "../ui/badge";
import { DateDisplay } from "@/app/utils/FormatDate";
import { useRouter } from "next/navigation";
import Image from "next/image";


import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { addLike, deleteLike, deletePost, fetchLikesByPostId, isLiked, PostLikeDto } from "@/services/postService";
import { AspectRatio } from "../ui/aspect-ratio";
import { getUser } from "@/services/authenticationService";

export type PostCardProps = {
    postId: string;
    avatarUrl: string;
    avatarFallback: string;
    username: string;
    createdAt: string;
    title: string;
    content: string;
    categories: string[];
    image: string;
    likes: number;
    comments: number;
    updatedAt: string;
    onDelete: (postId: number) => void;
  };
export function MyPostCard({
    postId,
    avatarUrl,
    avatarFallback,
    username,
    createdAt,
    title,
    content,
    categories,
    image,
    likes,
    comments,
    updatedAt,
    onDelete
  }: PostCardProps) {
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const profileImageUrl = `data:image/jpeg;base64,${avatarUrl}`;
    const postImageUrl = `data:image/jpeg;base64,${image}`;
    const [liked, setLiked] = useState<boolean>(false);
    const [likeId, setLikeId] = useState<number | null>(null);
    const [likesCounter, setLikesCounter] = useState<number>(likes);
    const handleUpdateClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      router.push(`/update/${postId}`);
    }

    const handleDeleteClick = async (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      await deletePost(Number(postId));
      onDelete(Number(postId));
    };

    const isEdited = Math.abs(new Date(createdAt).getTime() - new Date(updatedAt).getTime()) >= 60 * 1000;

    
    useEffect(() => {
        async function checkIfLiked() {
            const user = await getUser();
            
            if (postId) {
              const likedStatus = await isLiked(Number(postId)); // Check if current user liked the post
              setLiked(likedStatus);
              if (likedStatus) {
                // If liked, we should fetch the likeId to delete it later
                const data = await fetchLikesByPostId(Number(postId));
                console.log(data);
                // Assume the server returns the list of likes for the post
                // Now find the likeId of the current user and store it
                const userLike = data.find((like: PostLikeDto) => like.user.id === user.id);
                console.log(userLike);
                if (userLike) {
                  setLikeId(userLike.id); // Store the likeId for later use
                }
              }
            }
          }
      
          checkIfLiked();
        }, [likeId, postId]);
    

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (liked) {
        // If already liked, remove the like
        if (likeId) {
            await deleteLike(likeId); // Pass the likeId to delete the like
            setLiked(false); // Update local state to reflect the unlike
            setLikeId(null); // Clear the likeId after deletion
            setLikesCounter(prevLikes => prevLikes - 1);
        }
        } else {
        // If not liked, add the like
        const addedLike = await addLike({postId: Number(postId)});
        setLiked(true); // Update local state to reflect the like
        setLikeId(addedLike.id); // Store the likeId of the added like
        setLikesCounter(prevLikes => prevLikes - 1);
        }
    };
  
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
          <CardDescription className="text-sm text-muted-foreground line-clamp-3 " suppressHydrationWarning={true}>
            {content}
          </CardDescription>

          <div className="mt-3 flex flex-wrap gap-2 mb-4">
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

          <div suppressHydrationWarning={true}>
            <AspectRatio ratio={16 / 9} className="bg-muted"  suppressHydrationWarning={true}>
                <Image
                    
                    src={postImageUrl}
                    alt="Photo by Drew Beamer"
                    fill
                    className="h-full w-full rounded-md object-cover"
                />
            </AspectRatio>
            </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="flex space-x-4 items-center text-muted-foreground">
            <div
          className={`flex items-center space-x-1 cursor-pointer ${
            liked ? "text-red-500" : "text-gray-500"
          }`} // Change color based on liked state
          onClick={handleLike} // Handle click event to like/unlike
        >
          <Heart className="h-6 w-6" />
          <span>{likesCounter}</span> {/* Update likes count */}
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