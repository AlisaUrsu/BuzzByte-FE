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
        <div className="fixed top-0 left-0 right-0 w-screen z-50">
            <div className="max-w-[100vw] w-full bg-white shadow-md">
                <NavigationMenu className="relative flex w-full max-w-full items-center justify-between p-4">
                    <NavigationMenuList className="flex items-center space-x-2 w-1/4 pl-6">
                        <NavigationMenuItem className="flex items-center gap-2">
                            <img src="/buzzbytelogo.svg" alt="logo" className="h-6" />
                            <span className="font-bold text-gray-800">BuzzByte</span>
                        </NavigationMenuItem>
                    </NavigationMenuList>

                    <NavigationMenuList className="flex-1 mx-4">
                        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-full">
                            <Search className="text-gray-500 mr-2 flex-shrink-0" />
                            <Input
                                placeholder="Search"
                                className="bg-transparent border-none outline-none text-black placeholder-gray-500 w-full focus:ring-0"
                            />
                        </div>
                    </NavigationMenuList>

                    <NavigationMenuList className="flex items-center space-x-4 w-1/4 justify-end">
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
            </div>
        </div>
    );
}

export default NavBar;