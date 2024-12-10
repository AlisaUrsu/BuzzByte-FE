"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation"; // For fetching the `postTitle` from the URL
import { Badge } from "@/components/ui/badge"; // Assuming Badge component is in your UI library
import { Button } from "@/components/ui/button"; // Assuming Button component is in your UI library
import { Input } from "@/components/ui/input"; // Assuming Input component is in your UI library
import { fetchPostById, fetchPosts } from "@/services/postService"; // Replace with your API service function
import { PostDto, PostCommentDto } from "@/services/postService";
import { Bookmark, Heart, MessageCircle, Send } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DateDisplay } from "@/app/utils/FormatDate";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import NavBar from "@/components/news_and_posts/NavBar";


export default function PostPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const params = useParams();
  const postId = params.postId;
  const [post, setPost] = useState<PostDto | null>(null);
  const [newComment, setNewComment] = useState<string>("");
  const [comments, setComments] = useState<PostCommentDto[]>([]);
  const [liked, setLiked] = useState(false);
  const [commented, setCommented] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const newCommentLength = newComment.trim().length

  // Fetch post data by title
  useEffect(() => {
    async function loadPost() {
      try {
        const fetchedPost = await fetchPosts({pageNumber:0, pageSize: 1, postId: Number(postId)});
         // Replace with your API call
        setPost(fetchedPost.items[0]);
        setComments(fetchedPost.items.flatMap((post) => post.comments || []));
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    }
    loadPost();
  }, [postId]);

 

  if (!post) return <p>Loading...</p>;

  const isEdited = post.createdAt !== post.updatedAt;

  return (
    <><NavBar /><Card className="max-w-3xl mx-auto p-10 pt-3">
      {/* Post Header */}
      <CardHeader className="">
        <div className="-ml-6 -mb-2">

          <div className="flex items-center space-x-2">
            <Avatar className="w-9 h-9 rounded-full">
              <AvatarImage className="w-9 h-9 rounded-full" src={"https://miamistonesource.com/wp-content/uploads/2018/05/no-avatar-25359d55aa3c93ab3466622fd2ce712d1.jpg"} />
              <AvatarFallback>{post.userDto.username}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{post.userDto.username}</span>
            <div className="text-xs text-muted-foreground"><DateDisplay dateString={post.createdAt}></DateDisplay></div>
            {isEdited && (
              <span className="text-xs text-muted-foreground">(Edited)</span>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Post Title */}
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>

      {/* Post Tags */}
      <div className="mb-6 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Badge key={tag.id} variant="secondary">
            {tag.name}
          </Badge>
        ))}
      </div>

      {/* Post Content */}
      <p className="text-base text-gray-700 mb-6">{post.content}</p>

      {/* Actions */}
      <div className="mt-4 mb-4 flex justify-between items-center">
        <div className="flex space-x-4 items-center text-muted-foreground">
          <div
            className={`flex items-center space-x-1 cursor-pointer ${liked ? "text-red-500" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setLiked(!liked);
            } }
          >
            <Heart className="h-6 w-6" />
            <span>{post.likes + (liked ? 1 : 0)}</span>
          </div>

          <div
            className={`flex items-center space-x-1 cursor-pointer ${commented ? "text-blue-500" : ""}`}

          >
            <MessageCircle className="h-6 w-6" />
            <span>{comments.length}</span>
          </div>
        </div>

        <div
          className={`cursor-pointer ${bookmarked ? "text-yellow-500" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setBookmarked(!bookmarked);
            
          } }
        >
          
          <Bookmark className="h-6 w-6" />
        </div>
      </div>
      {/* Comments Section */}
      <Separator />
      <form
        className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring mt-4">
        <Textarea
          id="comment"
          placeholder="What do you think?"
          className="min-h-12 resize-none border-none p-3 shadow-none focus-visible:ring-0"
          autoComplete="off"
          value={newComment}
          onChange={(event) => setNewComment(event.target.value)} />
        <div className="flex items-center p-3 pt-0">
          <Button type="submit" size="sm" className="flex justify-end ml-auto gap-1.5" disabled={newCommentLength === 0}>
            Comment
          </Button>
        </div>


      </form>
      <div>
        <h2 className="text-lg font-semibold mt-4">Comments</h2>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="-mb-2 -ml-6 -mr-6">
              <Card className="border-none">
                <CardHeader>
                  <div className=" -mb-4">
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-7 h-7 rounded-full">
                        <AvatarImage className="w-7 h-7 rounded-full" src={"https://miamistonesource.com/wp-content/uploads/2018/05/no-avatar-25359d55aa3c93ab3466622fd2ce712d1.jpg"} />
                        <AvatarFallback>{comment.user.username}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{comment.user.username}</span>
                      <div className="text-xs text-muted-foreground"><DateDisplay dateString={comment.createdAt}></DateDisplay></div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="text-sm ">{comment.content}</CardContent>
              </Card>
            </div>
          ))
        ) : (
          <p className="text-sm">No comments yet.</p> 
        )}
      </div>

    </Card></>
  );
}
