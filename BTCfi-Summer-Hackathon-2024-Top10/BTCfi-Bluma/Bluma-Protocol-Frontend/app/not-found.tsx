"use client";

import { Button } from "@/components/ui/button";
import { site } from "@/constants";
import Link from "next/link";
import { useEffect } from "react";

export default function NotFoundPage() {
  useEffect(() => {
    document.title = `Page Not Found ・ ${site.name}`;
  }, []);

  return (
    <div className="flex items-center justify-center flex-col text-center flex-1 relative">
      {/* <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl font-black opacity-10 -z-10">
        {site.name}
      </h1> */}
      <h1 className="mb-4 text-3xl md:text-4xl lg:text-5xl font-bold">
        404 - Page Not Found
      </h1>
      <p className="text-base md:text-lg max-w-lg mx-auto">
        The page you are trying to access is either not available or has been
        moved or is still being built.
      </p>
      <Link
        href="/home"
        className="flex items-center mt-4 text-initial hover:underline text-sm md:text-base"
      >
        Take me back to the home page
      </Link>
    </div>
  );
}
