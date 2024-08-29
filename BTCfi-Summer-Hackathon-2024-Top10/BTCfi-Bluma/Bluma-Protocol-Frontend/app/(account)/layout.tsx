"use client";

import LoadingScreen from "@/components/shared/loading-screen";
import MaxWrapper from "@/components/shared/max-wrapper";
import { useGlobalContext } from "@/providers/global-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfileLayout({ children }: ILayout) {
  const router = useRouter();
  const { credentials, isFetchingUser } = useGlobalContext();

  useEffect(() => {
    if (!credentials) {
      router.push("/sign-in");
    }
  }, [credentials, router]);

  if (isFetchingUser) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex flex-col h-full w-full">{children}</div>
    </div>
  );
}
