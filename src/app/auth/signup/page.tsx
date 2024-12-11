"use client"

import CategoryPickPage from "@/components/login/category-pick";
import SignUpForm from "@/components/login/signup-form";
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "recharts";

import { Alert } from "@/components/ui/alert";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addTagsToUserByUsername, enableUser, login, register } from "@/services/authenticationService";


export type User = {
    username: string;
    email: string;
    password: string;
    tags: string[];
}

// two pages, one for username email password, one for tag selection
//todo: make it so it lasts a refresh
export default function SignUpPage() {
    //const [page, setPage] = useState<number>(1);
    const pageRef = useRef<number>(1);
    const [user, setUser] = useState<User>({ username: "", password: "", email: "", tags: [] });

    const router = useRouter();

    const onNext = (username: string, email: string, password: string) => {
        //setPage(2);
        pageRef.current = 2;
        setUser({
            ...user,
            username,
            email,
            password,
        });

    }

    const goToCategories = () => {
        console.log("User:", user);
        pageRef.current = 3;
        setUser({
            ...user,
        });
    }

    async function onSubmit(tags: string[]) {
        setUser({
            ...user,
            tags: tags
        })
    
        //here user doesnt have the categories yet
        await addTagsToUserByUsername(user.username, tags);
        console.log("Tags successfully added for user:", user.username);

        // Automatically log in the user
        const loginRequest = {
            username: user.username,
            password: user.password, // Assuming password is already stored in the user object
        };
        console.log("Attempting to log in user...");
        await login(loginRequest);

        // Redirect to the home page or another relevant page
        router.push("/");
    }

    return (
        <>

            <div className="w-full h-screen flex items-center justify-center px-4">
                {pageRef.current === 1 && <Page1 onNext={onNext} />}
                {pageRef.current === 2 && <Page2 onNext={goToCategories} user={user} />}
                {pageRef.current === 3 && <CategoryPickPage user={user} onSubmit={onSubmit} />}

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
                <p className="text-sm text-white m-4">
                    Already have an account?{" "}
                    <a href="/auth/login" className="text-blue-500 hover:underline">
                        Log In
                    </a>
                </p>
            </div>


            <div className="flex-1 flex justify-center items-center ">
                <SignUpForm onNext={onNext} />
            </div>
        </div>
    );
}

type Page2Props = {
    onNext: () => void;
    user: User;
}

function Page2({ onNext, user }: Page2Props) {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();


        if (!code) {
            setError('Activation code is required');
        } else {
            setError('');

            console.log('Form submitted with code:', code);
            try {
                await enableUser(code);
                alert("Account activated successfully!")
                onNext();
            }
            catch {
                setError('Invalid activation code');
            }
        }
    };

    useEffect(() => {
        const fn = async () => {
            if (user && user.email) {
                await register(user)
            }
            else {
                alert("Cannot create account without email!")
            }

        };
        fn();
    }, [])

    return (
        <Card className="w-full max-w-md h-[35%] ">
            <CardHeader>
                <CardTitle className="text-2xl">Activate your account</CardTitle>
                <CardDescription>
                    We've sent your activation code to {user.email}
                </CardDescription>

            </CardHeader>
            <form className="py-12" onSubmit={handleSubmit}>
                <CardContent className="grid gap-8">
                    <div className="grid gap-2">
                        <Label>Activation code</Label>
                        <Input
                            type="text"
                            id="code"
                            placeholder="Enter your code"
                            required
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                        {error && (
                            <Alert variant="destructive" className="text-center">
                                {error}
                            </Alert>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" onSubmit={handleSubmit}>Activate</Button>
                </CardFooter>
            </form>
        </Card>
    );
}



