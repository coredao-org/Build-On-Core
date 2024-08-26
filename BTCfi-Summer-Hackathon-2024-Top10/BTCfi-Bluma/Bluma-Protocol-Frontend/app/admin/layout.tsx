"use client";

import LoadingScreen from "@/components/shared/loading-screen";
import MaxWrapper from "@/components/shared/max-wrapper";
import { useGlobalContext } from "@/providers/global-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AccountsLayout({ children }: ILayout) {
  const router = useRouter();
  const { credentials, isFetchingUser } = useGlobalContext();

  useEffect(() => {
    if (
      credentials &&
      credentials?.address !== process.env.NEXT_PUBLIC_ADMIN_ADDRESS
    ) {
      router.back();
    }
  }, [credentials, router]);

  if (isFetchingUser) {
    return <LoadingScreen />;
  }

  return (
    <MaxWrapper className="flex-1 flex flex-col">
      <div className="flex-1 flex flex-col h-full py-4 pt-6 md:pt-12 w-full">
        {children}
      </div>
    </MaxWrapper>
  );
}
