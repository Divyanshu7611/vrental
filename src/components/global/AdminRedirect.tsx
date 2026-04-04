"use client";
import { useContext, useEffect } from "react";
import { UserContext } from "@/context/UserContext";
import { useRouter, usePathname } from "next/navigation";

export default function AdminRedirect({ children }: { children: React.ReactNode }) {
  const userContext = useContext(UserContext);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If user is admin and not already on admin page, redirect to admin dashboard
    if (userContext?.userAuthData?.role === "ADMIN" && pathname === "/") {
      router.push("/admin");
    }
  }, [userContext, router, pathname]);

  return <>{children}</>;
}
