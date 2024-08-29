"use client";

import EventCard from "@/components/cards/event-card";
import ProfileCard from "@/components/cards/profile-card";
import LoadingProfileCard from "@/components/loaders/loading-profile-card";
import MaxWrapper from "@/components/shared/max-wrapper";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { dummyEvents } from "@/constants";
import { cn, shortenAddress } from "@/lib/utils";
import { useGlobalContext } from "@/providers/global-provider";
import {
  getAllEvents,
  getAllTickets,
  getUser,
} from "@/services/bluma-contract";
import { getUserBalance } from "@/services/bluma-token";
import { LayoutList, List, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoCalendarOutline } from "react-icons/io5";

interface IUserWithDetails {
  credentials: ICredential | undefined;
  hostedEvents: IEvent[] | undefined;
  attendedTickets: ITicket[] | undefined;
  mintedTokenBalance: string | undefined;
}

export default function ProfilePage({
  params: { address },
}: {
  params: { address: string };
}) {
  const { credentials } = useGlobalContext();

  const [isFetchingUser, setIsFetchingUser] = useState(true);
  const [compact, setCompact] = useState(true);
  const [currentUser, setCurrentUser] = useState<
    IUserWithDetails | undefined
  >();

  useEffect(() => {
    (async () => {
      try {
        const user: ICredential | undefined = await getUser(address);

        const mintedTokenBalance = await getUserBalance(address);

        const events = await getAllEvents();
        const tickets = await getAllTickets();

        const attendedTickets = tickets?.filter(
          (ticket: any) => ticket?.buyer === user?.address,
        );

        const userWithDetails: IUserWithDetails = {
          credentials: user,
          hostedEvents: events?.filter(
            (event: IEvent) => event?.owner?.address === user?.address,
          ),
          attendedTickets: attendedTickets,
          mintedTokenBalance: (mintedTokenBalance / 10 ** 18).toLocaleString(),
        };

        setCurrentUser(userWithDetails);
      } catch (error) {
        console.error("ERROR FETCHING USERS: ", error);
      } finally {
        setIsFetchingUser(false);
      }
    })();
  }, []);

  return (
    <div className="flex flex-col">
      {isFetchingUser ? (
        <LoadingProfileCard />
      ) : (
        <ProfileCard currentUser={currentUser!} />
      )}

      <MaxWrapper className="px-4 py-6 flex flex-col gap-6">
        {!isFetchingUser && (
          <div className="flex items-end justify-between">
            <h1 className="font-bold text-xl md:text-2xl">Events</h1>

            <div className="bg-secondary/50 p-[2px] rounded-md flex items-center">
              <div
                onClick={() => setCompact(false)}
                className={cn(
                  "flex items-center justify-center rounded-sm text-xs text-center font-semibold cursor-pointer h-7 w-9 transition-colors",
                  {
                    "bg-secondary": !compact,
                  },
                )}
              >
                <LayoutList size={16} />
              </div>
              <div
                onClick={() => setCompact(true)}
                className={cn(
                  "flex items-center justify-center rounded-sm text-xs text-center font-semibold cursor-pointer h-7 w-9 transition-colors",
                  {
                    "bg-secondary": compact,
                  },
                )}
              >
                <List size={16} />
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col">
          {isFetchingUser ? (
            Array.from({ length: 4 }).map((_, _key) => (
              <div
                className="flex items-start flex-col md:flex-row w-full gap-4 md:gap-6 group"
                key={_key}
              >
                <div className="mb-4 max-w-full md:max-w-[612px] w-full">
                  <div className="w-full h-max rounded-xl p-3 bg-secondary/30 flex flex-col sm:flex-row items-start justify-between gap-4 md:gap-6">
                    <div className="flex flex-col">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-6 w-72 my-3" />
                      <div className="text-sm flex items-center gap-2 w-max group mb-2">
                        <Skeleton className="size-4 rounded-full" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <div className="text-sm flex items-center gap-2 w-max group mb-4">
                        <Skeleton className="size-4 rounded-full" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                      <div className="text-sm flex items-center gap-2 w-max group">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="size-4 rounded-full" />
                      </div>
                    </div>

                    <Skeleton className="w-full sm:w-[147px] aspect-[1.3] sm:aspect-square rounded-xl" />
                  </div>
                </div>
              </div>
            ))
          ) : currentUser?.hostedEvents?.length === 0 ? (
            <div className="flex items-center justify-center flex-col py-28">
              <IoCalendarOutline className="text-muted-foreground mb-4 opacity-50 w-28 h-28" />
              {credentials?.address === address ? (
                <>
                  <h1 className="text-base md:text-xl font-bold">
                    No Upcoming Events
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    You have no upcoming events. Why not host one?
                  </p>
                  <Button variant="secondary" className="mt-4 pl-3" asChild>
                    <Link href="/create" className="flex items-center">
                      <Plus size={16} className="mr-2" />
                      Create Event
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <h1 className="text-base md:text-xl font-bold">
                    No Upcoming Events
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    {shortenAddress(`${currentUser?.credentials?.address}`)}{" "}
                    have no upcoming events.
                  </p>
                </>
              )}
            </div>
          ) : (
            currentUser?.hostedEvents
              ?.slice()
              .reverse()
              .map((event: IEvent) => (
                <EventCard
                  hide
                  event={event}
                  key={event.eventId}
                  compact={compact}
                />
              ))
          )}
        </div>
      </MaxWrapper>
    </div>
  );
}
