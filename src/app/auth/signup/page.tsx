"use client"

import CategoryPickPage from "@/components/login/category-pick";
import SignUpForm from "@/components/login/signup-form";
import { useState } from "react"
import { useRouter } from "next/navigation";


type User = {
    username: string;
    email: string;
    password: string;
    categories: string[];
}

// two pages, one for username email password, one for tag selection
//todo: make it so it lasts a refresh
export default function SignUpPage() {
    const [page, setPage] = useState<number>(1);
    const [user, setUser] = useState<User>({ username: "", password: "", email: "", categories: [] });

    const router = useRouter();

    const onNext = (username: string, email: string, password: string) => {
        setPage(2);
        setUser({
            ...user,
            username,
            email,
            password,
        });

    }

    const onSubmit = (categories: string[]) => {
        setUser({
            ...user,
            categories
        })

        console.log("USER:", user)
        // post to backend and store in local storage the tokens + username
        localStorage.setItem("username", user.username)
        router.push("/")
    }

    return (
        <>

            <div className="w-full h-screen flex items-center justify-center px-4">
                {page === 1 ? <SignUpForm onNext={onNext} /> : <div className="w-[60%]"><CategoryPickPage onSubmit={onSubmit} /></div>}
            </div>

        </>
    );
}
