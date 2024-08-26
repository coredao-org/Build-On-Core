import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function LoadDetails() {
  return (
    <div className="flex flex-col md:flex-row gap-12 md:gap-8">
      <div className="flex flex-col gap-4 max-w-full md:max-w-[350px] w-full h-max md:sticky md:top-[86px]">
        <Skeleton className="w-full rounded-xl aspect-square relative" />
      </div>

      <div className="flex-1 h-max flex flex-col gap-4">
        <Skeleton className="w-full h-px" />
        <Skeleton className="w-[calc(100%-40%)] h-9" />
        <Skeleton className="w-full h-px" />

        <div className="flex flex-col gap-2">
          <div className="flex justify-start items-center gap-3">
            <Skeleton className="size-8" />
            <Skeleton className="h-4 w-24" />
          </div>

          <div className="flex justify-start items-center gap-3">
            <Skeleton className="size-8" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>

        <Skeleton className="rounded-lg aspect-[3.2]" />

        <Skeleton className="rounded-lg h-9 my-4" />

        <div className="flex flex-col w-full">
          <Skeleton className="h-4 w-24 mb-4" />
          <Skeleton className="h-px w-full mb-4" />

          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[calc(100%-40%)]" />
            <Skeleton className="h-4 w-[calc(100%-10%)]" />
            <Skeleton className="h-4 w-[calc(100%-50%)]" />
            <Skeleton className="h-4 w-[calc(100%-69%)]" />
            <Skeleton className="h-4 w-[calc(100%-30%)]" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
