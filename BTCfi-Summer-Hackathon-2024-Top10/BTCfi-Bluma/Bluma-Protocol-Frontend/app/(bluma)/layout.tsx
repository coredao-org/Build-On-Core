"use client";

import Footer from "@/components/shared/footer";
import LoadingScreen from "@/components/shared/loading-screen";
import MaxWrapper from "@/components/shared/max-wrapper";
import { useGlobalContext } from "@/providers/global-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({ children }: ILayout) {
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
    <MaxWrapper className="flex-1 flex flex-col">
      <main className="flex-1 pt-8 pb-16 px-4 md:px-0">{children}</main>
      <Footer />
    </MaxWrapper>
  );
}
