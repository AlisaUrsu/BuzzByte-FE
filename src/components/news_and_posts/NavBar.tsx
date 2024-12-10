"use client";

import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem
} from "@/components/ui/navigation-menu";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react";
import { NewsCardProps } from "./NewsCard";
import { fetchNews } from "@/services/newsService";
import { NewsModal } from "./NewsModal";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

const NavBar: React.FC = () => {
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState<NewsCardProps[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState<NewsCardProps | null>(null);

    const router = useRouter();

    const handleNewPostClick = () => {
        router.push("/add");
    };

    const handlePostsClick = () => {
        router.push("/posts");
        console.log("plm");
    }

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim()) {
            const allNews = await fetchNews();
            const filteredNews = allNews.filter((article) =>
                article.title.toLowerCase().includes(value.toLowerCase())
            );
            setSearchResults(filteredNews);
        } else {
            setSearchResults([]);
        }
    };

    const handleNewsClick = (news: NewsCardProps) => {
        setSelectedNews(news);
        setIsModalOpen(true);
        setSearchResults([]); // Clear search results
        setQuery(""); // Clear search input
    };

    const handleNewsButtonClick = () => {
        router.push('/');
    }

    const handleMyPostsClick = () => {
        router.push("/my-posts")
    }

    return (
        <NavigationMenu className="flex max-w-full items-center justify-between p-4 bg-white shadow-md">
            <NavigationMenuList className="flex items-center space-x-6">
                <NavigationMenuItem className="flex items-center gap-2" onClick={handleNewsButtonClick}>
                    <img src="/buzzbytelogo.svg" alt="logo" className="h-10 cursor-pointer" />
                    <span className="font-bold text-gray-800 text-xl cursor-pointer">BuzzByte</span>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <button className="text-gray-600 hover:text-gray-900 font-medium transition-colors" onClick={handleNewsButtonClick}>
                        News
                    </button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <button className="text-gray-600 hover:text-gray-900 font-medium transition-colors" onClick={handlePostsClick}>
                        Posts
                    </button>
                </NavigationMenuItem>
            </NavigationMenuList>

            <NavigationMenuList className="flex-1 mx-8 relative">
                <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                    placeholder="Search"
                    value={query}
                    onChange={handleSearch}
                    className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                />

                {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-lg mt-2 z-50 max-h-60 overflow-y-auto">
                        {searchResults.map((result, index) => (
                            <div
                                key={index}
                                className="p-4 border-b last:border-none hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleNewsClick(result)}
                            >
                                <p className="text-sm font-bold">{result.title}</p>
                                <p className="text-xs text-gray-500">{result.date}</p>
                            </div>
                        ))}
                    </div>
                )}
            </NavigationMenuList>

            <NavigationMenuList className="flex items-center space-x-4 w-[180px] justify-end pr-2">
                <NavigationMenuItem>
                    <Button className="bg-black text-white font-semibold rounded px-4 py-1" onClick={handleNewPostClick}
                    >
                        New Post
                    </Button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="rounded-full w-8 h-8 cursor-pointer">
                                <AvatarImage src="https://miamistonesource.com/wp-content/uploads/2018/05/no-avatar-25359d55aa3c93ab3466622fd2ce712d1.jpg" />
                                <AvatarFallback>NA</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleMyPostsClick}>My Posts</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">Logout</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push("/bookmarks")}>My Bookmarks</DropdownMenuItem>

                        </DropdownMenuContent>
                    </DropdownMenu>

                </NavigationMenuItem>
            </NavigationMenuList>


            {selectedNews && (
                <NewsModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedNews(null);
                    }}
                    {...selectedNews}
                    comments={[]}
                    onAddComment={() => { }}
                    postId="1"
                />
            )}
        </NavigationMenu>
    );
}

export default NavBar;