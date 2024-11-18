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

const NavBar: React.FC = () => {
    return (
        <NavigationMenu className="flex max-w-full items-center justify-between p-4 bg-white shadow-md">
            <NavigationMenuList className="flex items-center">
                <NavigationMenuItem className="flex items-center gap-2">
                    <img src="/buzzbytelogo.svg" alt="logo" className="h-10" />
                    <span className="font-bold text-gray-800 text-xl">BuzzByte</span>
                </NavigationMenuItem>
            </NavigationMenuList>

            <NavigationMenuList className="flex-grow mx-12">
                <div className="flex items-center bg-gray-100 rounded-lg px-28 py-2">
                    <Search className="text-gray-500 mr-2 flex-shrink-0" />
                    <Input
                        placeholder="Search"
                        className="bg-transparent border-none outline-none text-black placeholder-gray-500 w-full focus:ring-0 "
                    />
                </div>
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
        </NavigationMenu>
    );
}

export default NavBar;