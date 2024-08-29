"use client";

import LoadingScreen from "@/components/shared/loading-screen";
import MaxWrapper from "@/components/shared/max-wrapper";
import { site } from "@/constants";
import { useGlobalContext } from "@/providers/global-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({ children }: ILayout) {
  const router = useRouter();
  const { credentials, isFetchingUser } = useGlobalContext();

  useEffect(() => {
    document.title = `Sign In ・ ${site.name}`;

    if (credentials) {
      router.push("/home");
    }
  }, [credentials, router]);

  if (isFetchingUser) {
    return <LoadingScreen />;
  }

  return (
    <MaxWrapper className="flex-1 flex flex-col">
      <div className="flex justify-center flex-col items-center my-20 md:my-28">
        {children}
      </div>
    </MaxWrapper>
  );
}
