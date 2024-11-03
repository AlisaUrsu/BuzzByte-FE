
"use client"

import LoginForm from "@/components/login/login-form";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const handleLoginSuccess = () => {
        router.push("/");

    };

    return (
        <div className="w-full h-screen flex items-center justify-center px-4">
            <LoginForm onLoginSuccess={handleLoginSuccess} />
        </div>
    );
}