"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Select, SelectTrigger, SelectContent, SelectItem } from "../ui/select";
import { MoreHorizontal, Heart, MessageCircle, Bookmark, Twitter, Facebook, Linkedin, Link as LinkIcon } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export type NewsCardProps = {
  avatarUrl: string;
  avatarFallback: string;
  userName: string;
  date: string;
  title: string;
  description: string;
  imageUrl: string;
  sourceUrl: string;
  onHide: (sourceUrl: string) => void;
  categories: string[];
  likes: number;
  comments: number;
  urlToImage: string;
};

import { NewsModal } from "./NewsModal";
import { Comment } from "./NewsComments";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

export function NewsCard({
  avatarUrl,
  avatarFallback,
  userName,
  date,
  title,
  description,
  urlToImage,
  sourceUrl,
  categories,
  likes,
  comments,
  onHide
}: NewsCardProps & { onHide: (sourceUrl: string) => void }) {
  const [liked, setLiked] = useState(false);
  const [commented, setCommented] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const [isHidden, setIsHidden] = useState(false);

  const handleHide = () => {
    setIsHidden(true);
    setTimeout(() => onHide(sourceUrl), 500); // Delay to allow fade-out animation
  };

  const ShareModal = ({ isOpen, onClose, title, sourceUrl }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    sourceUrl: string;
  }) => {
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(sourceUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(sourceUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(sourceUrl)}`
    };

    const copyToClipboard = async () => {
      await navigator.clipboard.writeText(sourceUrl);
      toast({
        title: "Link copied!",
        description: "The article link has been copied to your clipboard.",
      });
    };

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Article</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 p-4">
            <a
              href={shareUrls.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-2 rounded-lg bg-[#1DA1F2] text-white hover:bg-opacity-90"
            >
              <Twitter className="h-5 w-5" />
              <span>Twitter</span>
            </a>
            <a
              href={shareUrls.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-2 rounded-lg bg-[#4267B2] text-white hover:bg-opacity-90"
            >
              <Facebook className="h-5 w-5" />
              <span>Facebook</span>
            </a>
            <a
              href={shareUrls.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-2 rounded-lg bg-[#0077B5] text-white hover:bg-opacity-90"
            >
              <Linkedin className="h-5 w-5" />
              <span>LinkedIn</span>
            </a>
            <button
              onClick={copyToClipboard}
              className="flex items-center justify-center gap-2 p-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              <LinkIcon className="h-5 w-5" />
              <span>Copy Link</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
      <Card
        className={`
            max-w-lg shadow-md border relative cursor-pointer
            transition-all duration-500 ease-in-out
            ${isHidden ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
          `}
        onClick={toggleModal}
      >
        <CardHeader className="p-4 flex items-center justify-between">
          <div className="absolute top-2 left-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatarUrl} alt="avatar" />
              <AvatarFallback>
                <svg
                  version="1.0"
                  xmlns="http://www.w3.org/2000/svg"
                  width="512.000000pt"
                  height="512.000000pt"
                  viewBox="-230 100 1000 700"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g
                    transform="translate(0.000000,700.000000) scale(0.100000,-0.100000)"
                    fill="#000000"
                    stroke="none"
                  >
                    <path
                      d="M159 4805 c-49 -16 -108 -67 -136 -118 -17 -30 -18 -144 -21 -1937
-2 -1368 1 -1924 9 -1972 27 -167 158 -341 311 -413 145 -69 0 -65 2238 -65
2238 0 2093 -4 2238 65 153 72 284 246 311 413 8 48 11 527 9 1683 l-3 1616
-30 49 c-19 30 -49 60 -79 79 l-49 30 -209 3 -208 3 0 198 c0 192 -1 198 -26
249 -30 61 -74 98 -140 118 -70 21 -4146 20 -4215 -1z m4153 -2022 l3 -1808
27 -51 c45 -85 137 -150 218 -154 72 -4 89 0 119 31 26 26 31 38 31 79 0 40
-5 53 -30 78 -18 19 -45 33 -70 37 -76 13 -70 -119 -70 1532 l0 1483 175 0
175 0 -2 -1602 -3 -1603 -31 -65 c-40 -82 -92 -134 -174 -174 l-65 -31 -2055
0 -2055 0 -65 31 c-82 40 -134 92 -174 174 l-31 65 -3 1893 -2 1892 2040 0
2040 0 2 -1807z"
                    />
                    <path
                      d="M734 4086 c-28 -28 -34 -42 -34 -76 0 -55 30 -96 78 -110 25 -6 527
-10 1500 -10 1213 0 1468 2 1495 14 43 17 69 59 69 107 -1 45 -16 71 -53 93
-25 15 -163 16 -1524 16 l-1497 0 -34 -34z"
                    />
                    <path
                      d="M788 3543 c-47 -7 -86 -56 -93 -116 -3 -28 -5 -311 -3 -627 3 -626 0
-597 60 -638 21 -15 83 -17 624 -20 652 -3 658 -2 698 51 21 28 21 35 21 646
0 669 1 651 -54 688 -24 17 -71 18 -626 19 -330 1 -612 -1 -627 -3z m1072
-698 l0 -465 -465 0 -465 0 0 465 0 465 465 0 465 0 0 -465z"
                    />
                    <path
                      d="M2538 3543 c-34 -5 -84 -53 -90 -88 -13 -67 33 -130 105 -140 23 -3
305 -5 627 -3 539 3 587 4 611 21 70 47 70 147 0 194 -24 17 -71 18 -626 19
-330 1 -612 -1 -627 -3z"
                    />
                    <path
                      d="M2538 2963 c-34 -5 -84 -53 -90 -88 -13 -67 33 -130 105 -140 23 -3
305 -5 627 -3 539 3 587 4 611 21 70 47 70 147 0 194 -24 17 -71 18 -626 19
-330 1 -612 -1 -627 -3z"
                    />
                    <path
                      d="M2533 2383 c-13 -2 -36 -17 -52 -33 -74 -75 -29 -182 82 -195 28 -3
311 -5 627 -3 529 3 577 4 601 21 14 9 32 28 39 42 28 52 11 119 -39 152 -24
17 -72 18 -631 19 -333 1 -615 0 -627 -3z"
                    />
                    <path
                      d="M783 1803 c-13 -2 -36 -18 -53 -34 -25 -26 -30 -38 -30 -79 0 -67 38
-106 113 -115 28 -3 311 -5 627 -3 529 3 577 4 601 21 79 53 66 173 -22 204
-25 9 -191 12 -624 11 -324 0 -600 -3 -612 -5z"
                    />
                    <path
                      d="M2533 1803 c-13 -2 -36 -17 -52 -33 -74 -75 -29 -182 82 -195 28 -3
311 -5 627 -3 529 3 577 4 601 21 14 9 32 28 39 42 28 52 11 119 -39 152 -24
17 -72 18 -631 19 -333 1 -615 0 -627 -3z"
                    />
                    <path
                      d="M765 1216 c-42 -18 -65 -57 -65 -107 0 -33 6 -47 34 -75 l34 -34 621
0 c675 0 661 -1 691 55 32 59 6 135 -55 161 -49 20 -1214 20 -1260 0z"
                    />
                    <path
                      d="M2513 1215 c-42 -18 -65 -56 -65 -104 1 -46 15 -73 53 -95 24 -14 94
-16 644 -16 666 0 651 -1 684 52 18 29 16 94 -4 124 -35 54 -34 54 -682 54
-486 -1 -604 -3 -630 -15z"
                    />
                  </g>
                </svg>
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="text-xs text-center w-full text-muted-foreground font-semibold">
            {date}
          </div>

          <br />

          <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
            <Select onValueChange={(value) => {
              if (value === 'hide') {
                handleHide();
              } else if (value === 'share') {
                setIsShareModalOpen(true);
              }
            }}>
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

        {urlToImage && (
          <img
            src={urlToImage}
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
                className={`flex items-center space-x-1 cursor-pointer ${commented ? "text-blue-500" : ""
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

      <NewsModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        avatarUrl={avatarUrl}
        avatarFallback={avatarFallback}
        userName={userName}
        date={date}
        title={title}
        description={description}
        urlToImage={urlToImage}
        sourceUrl={sourceUrl}
        categories={categories}
        comments={[]}
        onAddComment={() => { }}
        postId="1"
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={title}
        sourceUrl={sourceUrl}
      />
    </>
  );
}