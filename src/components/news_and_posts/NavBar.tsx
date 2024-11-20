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

const NavBar: React.FC = () => {
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState<NewsCardProps[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState<NewsCardProps | null>(null);

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

    return (
        <NavigationMenu className="flex max-w-full items-center justify-between p-4 bg-white shadow-md">
            <NavigationMenuList className="flex items-center space-x-6">
                <NavigationMenuItem className="flex items-center gap-2">
                    <img src="/buzzbytelogo.svg" alt="logo" className="h-10" />
                    <span className="font-bold text-gray-800 text-xl">BuzzByte</span>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <button className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                        News
                    </button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <button className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                        Posts
                    </button>
                </NavigationMenuItem>
            </NavigationMenuList>

            <NavigationMenuList className="flex-1 mx-8 relative">
                <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-full">
                    <Search className="text-gray-500 mr-2 flex-shrink-0" />
                    <Input
                        placeholder="Search"
                        value={query}
                        onChange={handleSearch}
                        className="bg-transparent border-none outline-none text-black placeholder-gray-500 w-full focus:ring-0"
                    />
                </div>

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
                    <Button className="bg-black text-white font-semibold rounded px-4 py-1">
                        New Post
                    </Button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Avatar className="rounded-full w-8 h-8">
                        <AvatarImage src="https://miamistonesource.com/wp-content/uploads/2018/05/no-avatar-25359d55aa3c93ab3466622fd2ce712d1.jpg" />
                        <AvatarFallback>NA</AvatarFallback>
                    </Avatar>
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