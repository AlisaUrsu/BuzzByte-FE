"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "../ui/alert"


export const description =
    "A simple login form with email and password. The submit button says 'Log in'."

export const iframeHeight = "600px"

export const containerClassName =
    "w-full h-screen flex items-center justify-center px-4"


type SignUpFormData = z.infer<typeof signUpSchema>;




const signUpSchema = z.object({
    username: z.string(),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters").max(200, "Password must be at most 200 characters")
});

type SignUpFormProps = {
    onNext: (username: string, email: string, password: string) => void;
}

export default function SignUpForm({ onNext }: SignUpFormProps) {
    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    });



    const onSubmit = async (values: SignUpFormData) => {
        //pass the data to the page
        onNext(values.username, values.email, values.password);
    };



    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Sign up</CardTitle>
                <CardDescription>
                    Unlock exclusive features, personalized content, and connect with a vibrant community!
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="grid gap-8">

                    <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input {...register("username")} id="username" type="username" required onChange={() => clearErrors("root")} />
                        {errors.username && (
                            <Alert variant="destructive" className="text-center">
                                {errors.username.message}
                            </Alert>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input {...register("email")} id="email" type="email" placeholder="m@example.com" required onChange={() => clearErrors("root")} />
                        {errors.email && (
                            <Alert variant="destructive" className="text-center">
                                {errors.email.message}
                            </Alert>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input {...register("password")} id="password" type="password" required onChange={() => clearErrors("root")} />
                        {errors.password && (
                            <Alert variant="destructive" className="text-center">
                                {errors.password.message}
                            </Alert>
                        )}
                    </div>

                </CardContent>

                <CardFooter>
                    <Button className="w-full" type="submit" disabled={isSubmitting}> {isSubmitting ? "Loading..." : "Next"}</Button>
                </CardFooter>

                {errors.root && (
                    <Alert variant="destructive" className="text-center">
                        {errors.root.message}
                    </Alert>
                )}
            </form>
        </Card>
    )
}
