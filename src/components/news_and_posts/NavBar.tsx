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
import { useRouter } from "next/navigation";

const NavBar: React.FC = () => {
    const router = useRouter();

    const handleNewPostClick = () => {
        router.push("/add");
    };
    return (
        <NavigationMenu className="flex max-w-full items-center justify-between p-4 bg-white shadow-md">
            <NavigationMenuList className="flex items-center">
                <NavigationMenuItem className="flex items-center gap-2">
                    <img src="/buzzbytelogo.svg" alt="logo" className="h-10" />
                    <span className="font-bold text-gray-800 text-xl">BuzzByte</span>
                </NavigationMenuItem>
            </NavigationMenuList>

            <NavigationMenuList>
                <div >
                <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search news..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />

                </div>
            </NavigationMenuList>

            <NavigationMenuList className="flex items-center space-x-4 w-[180px] justify-end pr-2">
                <NavigationMenuItem>
                    <Button className="bg-black text-white font-semibold rounded px-4 py-1"
                            onClick={handleNewPostClick}
                    >
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