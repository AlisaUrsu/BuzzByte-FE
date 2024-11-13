
"use client"

import LoginForm from "@/components/login/login-form";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const handleLoginSuccess = () => {
        router.push("/");

    };

    return (
        <>

            <div className="w-full h-screen flex items-center justify-center px-4">
                <div className="w-full max-w-md flex flex-col items-center space-y-4">


                    <div className="w-full  p-6 shadow-md text-center">
                        <h1 className="text-4xl font-bold text-white">Welcome back</h1>
                    </div>

                    <div className="w-full  py-6 pl-10 shadow-md">
                        <LoginForm onLoginSuccess={handleLoginSuccess} />
                    </div>


                    <div className="w-full text-center mt-4">
                        <p className="text-sm text-white">
                            Don't have an account?{" "}
                            <a href="/auth/signup" className="text-blue-500 hover:underline">
                                Sign Up
                            </a>
                        </p>
                    </div>

                </div>
            </div>

            <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
        </>
    );
}