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

        //here user doesnt have the categories yet
        console.log("CATEGORIES: ", categories)
        // post to backend and store in local storage the tokens + username
        localStorage.setItem("username", user.username)
        localStorage.setItem("categories", JSON.stringify(categories))
        router.push("/")
    }

    return (
        <>

            <div className="w-full h-screen flex items-center justify-center px-4">
                {page === 1 ? (
                    <Page1 onNext={onNext} />
                ) : (

                    <CategoryPickPage onSubmit={onSubmit} />

                )}
            </div>
            {/* background might have to be fixed later*/}
            <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>

        </>
    );
}

type Page1Props = {
    onNext: (username: string, email: string, password: string) => void;
}

function Page1({ onNext }: Page1Props) {
    return (
        <div className="flex min-h-screen">

            <div className="flex-1 flex flex-col justify-center items-center text-white p-8">
                <h1 className="text-4xl font-semibold mb-4">Join Us Today!</h1>
                <p className="text-lg text-center">
                    Sign up to unlock exclusive features, enjoy personalized content, and connect with a vibrant community!
                </p>
            </div>

            <div className="flex-1 flex justify-center items-center ">
                <SignUpForm onNext={onNext} />
            </div>
        </div>
    );
}

