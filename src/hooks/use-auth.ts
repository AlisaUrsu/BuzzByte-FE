import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const useAuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const username = localStorage.getItem("username");

    if (!username) {
      router.push("/auth/signup");
    }
  }, [router]);
};
