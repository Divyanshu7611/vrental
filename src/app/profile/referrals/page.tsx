"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/global/Spinner";

/** Legacy URL: /profile/referrals → in-app referrals tab */
export default function ReferralsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/profile?tab=referrals");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Spinner />
    </div>
  );
}
