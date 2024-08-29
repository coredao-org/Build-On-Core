import MaxWrapper from "../shared/max-wrapper";
import { Skeleton } from "../ui/skeleton";

export default function LoadingProfileCard() {
  return (
    <div className="pb-0 sm:pb-4 lex flex-col border-b">
      <div className="w-full max-w-[680px] mx-auto">
        <Skeleton className="w-full h-52 rounded-none lg:rounded-2xl" />

        <MaxWrapper className="flex flex-col -mt-12 sm:-mt-[54px] px-4">
          <div className="flex items-end justify-between">
            <div className="size-24 sm:size-[108px] rounded-xl p-1 relative bg-background">
              <Skeleton className="size-full rounded-lg" />
            </div>

            <Skeleton className="h-9 rounded-md w-28" />
          </div>

          <div className="flex flex-col h-full flex-1 mt-4">
            <Skeleton className="h-4 w-44 mb-2" />

            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="size-[14px]" />
            </div>

            <div className="flex items-center w-full py-2">
              <p className="text-xs md:text-sm border-r pr-4">
                <Skeleton className="h-3 w-20" />
              </p>
              <p className="text-xs md:text-sm border-r px-4">
                <Skeleton className="h-3 w-20" />
              </p>
              <p className="text-xs md:text-sm pl-4">
                <Skeleton className="h-3 w-20" />
              </p>
            </div>
          </div>
        </MaxWrapper>
      </div>
    </div>
  );
}
