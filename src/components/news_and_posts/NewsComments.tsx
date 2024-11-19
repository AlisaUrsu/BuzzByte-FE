import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export type Comment = {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    content: string;
    createdAt: string;
    likes: number;
}

export type NewsCommentsProps = {
    postId: string;
    comments: Comment[];
    onAddComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'likes'>) => void;
}

export function NewsComments({ postId, comments, onAddComment }: NewsCommentsProps) {
    const [newComment, setNewComment] = useState('')
    const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest')

    const handleSubmitComment = () => {
        if (!newComment.trim()) return

        onAddComment({
            userId: 'current-user-id', // This would come from auth context
            userName: 'Current User', // This would come from auth context
            userAvatar: 'https://avatar-url.com', // This would come from auth context
            content: newComment
        })

        setNewComment('')
    }

    const sortedComments = [...comments].sort((a, b) => 
        sortBy === 'latest' 
            ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            : b.likes - a.likes
    )

    return (
        <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">{comments.length} Comments</h3>
                <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'latest' | 'popular')}
                    className="px-3 py-1 border rounded-md"
                >
                    <option value="latest">Latest</option>
                    <option value="popular">Popular</option>
                </select>
            </div>

            {/* Comment Input */}
            <div className="mb-8">
                <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="mb-2"
                />
                <Button 
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim()}
                    className="float-right"
                >
                    Post Comment
                </Button>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
                {sortedComments.map((comment) => (
                    <div key={comment.id} className="flex space-x-4">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={comment.userAvatar} />
                            <AvatarFallback>{comment.userName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold">{comment.userName}</span>
                                <span className="text-sm text-gray-500">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="mt-1 text-gray-700">{comment.content}</p>
                            <Button variant="ghost" size="sm" className="mt-2">
                                ❤️ {comment.likes}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}