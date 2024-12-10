"use client"
//form with email
//send token

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "recharts";

import { Alert } from "@/components/ui/alert";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { resetPassword } from "@/services/authenticationService";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const onNext = () => {
        router.push("/");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password.length < 6) {
            setError('Error must be longer than 5 characters!')
        }
        else {
            try {
                setError('');
                await resetPassword({ token: code, password: password });
                alert("Password reset successfully!")
                onNext();
            }
            catch {
                setError('Something went wrong...');
            }
        }

    };


    return (
        <div className="flex min-h-screen">
            <div className="flex-1 flex justify-center items-center ">
                <Card className="w-full max-w-md h-[35%] ">
                    <CardHeader>
                        <CardTitle className="text-2xl">Reset password</CardTitle>
                        <CardDescription>
                            Introduce your token and new password
                        </CardDescription>

                    </CardHeader>
                    <form className="py-12" onSubmit={handleSubmit}>
                        <CardContent className="grid gap-8">
                            <div className="grid gap-2">
                                <Label>Token</Label>
                                <Input
                                    id="token"
                                    placeholder="Enter your code"
                                    required
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                />
                                <Label>Password</Label>
                                <Input
                                    id="password"
                                    placeholder="Enter your password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {error && (
                                    <Alert variant="destructive" className="text-center">
                                        {error}
                                    </Alert>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full" onSubmit={handleSubmit}>Reset password</Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
            <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
        </div>
    );

}