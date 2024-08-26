"use client";

import { shortenAddress } from "@/lib/utils";
import { Copy, CheckCheck } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import MaxWrapper from "../shared/max-wrapper";
import { Button } from "../ui/button";

interface IUserWithDetails {
  credentials: ICredential | undefined;
  hostedEvents: IEvent[] | undefined;
  attendedTickets: ITicket[] | undefined;
  mintedTokenBalance: string | undefined;
}

export default function ProfileCard({
  currentUser,
}: {
  currentUser: IUserWithDetails;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        toast.success(`Copied ${shortenAddress(text)}`);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      })
      .catch((err) => {
        toast.error("Failed to copy");
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <div
      key={currentUser?.credentials?.address}
      className="pb-0 sm:pb-4 lex flex-col border-b"
    >
      <div className="w-full max-w-[680px] mx-auto">
        <div className="bg-secondary/50 border-b lg:border w-full h-52 rounded-none lg:rounded-2xl"></div>

        <MaxWrapper className="flex flex-col -mt-12 sm:-mt-[54px] px-4">
          <div className="flex items-end justify-between">
            <div className="size-24 sm:size-[108px] rounded-xl bg-background p-1 lg:border">
              <div className="size-full bg-secondary rounded-lg overflow-hidden">
                <Image
                  src={
                    `https://blue-quickest-opossum-600.mypinata.cloud/ipfs/${currentUser?.credentials?.avatar || "QmZVMhaKF2e3fQMD8Yzbq7Kx6WrgEwZH3EvqbaJ8UGQbiV"}` ||
                    `https://bronze-gigantic-quokka-778.mypinata.cloud/ipfs/${currentUser?.credentials?.avatar}`
                  }
                  alt={currentUser?.credentials?.email as string}
                  width={104}
                  height={104}
                  priority
                  className="size-full object-cover"
                />
              </div>
            </div>

            <Button variant="outline" disabled size="sm" className="mb-1">
              Subscribe
            </Button>
          </div>

          <div className="flex flex-col h-full flex-1 mt-4">
            <h1 className="font-semibold text-base md:text-lg truncate">
              {currentUser?.credentials?.email}
            </h1>
            <p className="text-xs md:text-sm flex items-center gap-2 font-semibold text-muted-foreground">
              {currentUser?.credentials?.address}{" "}
              {copied ? (
                <CheckCheck size={14} className="text-green-500" />
              ) : (
                <Copy
                  onClick={() =>
                    handleCopy(currentUser?.credentials?.address as string)
                  }
                  size={14}
                  className="cursor-pointer"
                />
              )}
            </p>

            <div className="flex items-center w-full py-2">
              <p className="text-xs md:text-sm border-r pr-4">
                <b>{currentUser?.hostedEvents?.length || 0}</b> Hosted
              </p>
              <p className="text-xs md:text-sm border-r px-4">
                <b>{currentUser?.attendedTickets?.length || 0}</b> Attended
              </p>
              <p className="text-xs md:text-sm border-r px-4">
                <b>{currentUser?.credentials?.balance} BLUM</b> Earnings
              </p>
              <p className="text-xs md:text-sm pl-4">
                <b>{currentUser?.mintedTokenBalance} BLUM</b> Minted
              </p>
            </div>
          </div>
        </MaxWrapper>
      </div>
    </div>
  );
}
