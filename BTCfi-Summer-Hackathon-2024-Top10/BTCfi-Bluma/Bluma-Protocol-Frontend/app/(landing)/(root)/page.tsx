"use client";

import Logo from "@/components/shared/logo";
import MaxWrapper from "@/components/shared/max-wrapper";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function RootPage() {
  return (
    <div className="flex flex-col py-10">
      <MaxWrapper className="flex-1 flex flex-col">
        <div className="flex justify-center items-center flex-1 flex-col lg:flex-row gap-8 md:gap-4">
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-start">
            <h1 className="font-black text-4xl md:text-5xl lg:text-6xl lg:leading-[66px]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4479F5] via-[#EF57C6] to-[#FF6F48]">
                Delightful
              </span>{" "}
              events
            </h1>
            <h1 className="font-black text-4xl md:text-5xl lg:text-6xl lg:leading-[66px]">
              starts{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4479F5] via-[#EF57C6] to-[#FF6F48]">
                here
              </span>
            </h1>

            <p className="font-medium text-sm sm:text-base md:text-lg mt-2 md:mt-5 mb-4 md:mb-7">
              Create event, sell tickets, chat with guests, and mint NFTs for
              attendees. Begin planning your unique event trip today.
            </p>

            <Button asChild size="lg" className="hidden md:flex">
              <Link href="/create" className="w-max">
                Create Your First Event
              </Link>
            </Button>
            <Button asChild className="flex md:hidden">
              <Link href="/create" className="w-max">
                Create Your First Event
              </Link>
            </Button>
          </div>
          <div className="max-w-[550px] w-full relative px-8">
            <Image
              src="/assets/landing.png"
              alt="landing"
              width={1150}
              height={1224}
              priority
              quality={100}
              className="size-full object-contain flex"
            />
          </div>
        </div>
      </MaxWrapper>

      <div className="md:px-4">
        <div className="mt-16 bg-secondary rounded-xl md:rounded-3xl border w-full h-max mx-auto max-w-7xl p-1 md:p-2">
          <div className="size-full rounded-lg md:rounded-2xl overflow-hidden bg-background">
            <Image
              src="/assets/banner.png"
              alt="banner"
              width={3360}
              height={2100}
              priority
              className="rounded-[inherit] h-max w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
