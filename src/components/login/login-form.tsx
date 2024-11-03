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
import { AlertDialog } from "@radix-ui/react-alert-dialog"
import { Alert } from "../ui/alert"

export const description =
    "A simple login form with email and password. The submit button says 'Sign in'."

export const iframeHeight = "600px"

export const containerClassName =
    "w-full h-screen flex items-center justify-center px-4"


type LoginFormData = z.infer<typeof loginSchema>;


const mockFetchLogin = async (values: LoginFormData): Promise<Response> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (values.email === "test@example.com" && values.password === "password123") {
                resolve({
                    ok: true,
                    json: async () => ({
                        accessToken: "mockAccessToken",
                        refreshToken: "mockRefreshToken",
                    }),
                } as Response);
            } else {
                resolve({
                    ok: false,
                    json: async () => ({ message: "Invalid email or password." }),
                } as Response);
            }
        }, 1000);
    });
};


const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters").max(200, "Password must be at most 200 characters")
});

export default function LoginForm() {
    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });


    const onSubmit = async (values: LoginFormData) => {

        try {
            // here we would have the actual fetch(backendurl, post)
            const response = await mockFetchLogin(values);
            console.log("Response received:", response);

            if (!response.ok) {
                const errorData = await response.json();
                console.log("Error data received:", errorData);
                throw new Error(errorData.message || "Login failed. Please try again.");
            }

            const data = await response.json();
            console.log("Login successful:", data);
        } catch (error: any) {
            console.log("Error during login:", error);
            setError("root", { message: error.message || "An unknown error occurred." });
        }
    };



    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="grid gap-8">

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
                    <Button className="w-full" type="submit" disabled={isSubmitting}> {isSubmitting ? "Loading..." : "Submit"}</Button>
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
