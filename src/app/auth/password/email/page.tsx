"use client"
//form with email
//send token

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "recharts";

import { Alert } from "@/components/ui/alert";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { requestPasswordReset } from "@/services/authenticationService";
import { useRouter } from "next/navigation";

export default function EmailSendTokenPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const onNext = () => {
        router.push("/auth/password/reset");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!email)//verify email pattern 
        {
            setError('Email is required');
        } else {
            setError('');

            console.log('Form submitted with email:', email);
            try {
                await requestPasswordReset(email);
                alert("Requested password reset successfully!")
                onNext();
            }
            catch {
                setError('Invalid email');
            }
        }
    };


    return (
        <div className="flex min-h-screen">
            <div className="flex-1 flex justify-center items-center ">
                <Card className="w-full max-w-md h-[35%] ">
                    <CardHeader>
                        <CardTitle className="text-2xl">Request password reset</CardTitle>
                        <CardDescription>
                            Introduce your email
                        </CardDescription>

                    </CardHeader>
                    <form className="py-12" onSubmit={handleSubmit}>
                        <CardContent className="grid gap-8">
                            <div className="grid gap-2">
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    id="code"
                                    placeholder="Enter your email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {error && (
                                    <Alert variant="destructive" className="text-center">
                                        {error}
                                    </Alert>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full" onSubmit={handleSubmit}>Send Email</Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
            <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
        </div>
    );

}