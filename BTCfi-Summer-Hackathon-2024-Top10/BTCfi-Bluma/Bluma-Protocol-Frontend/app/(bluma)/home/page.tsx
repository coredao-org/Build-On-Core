"use client";

import EventCard from "@/components/cards/event-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { dummyEvents, site } from "@/constants";
import { getBlumaContracts } from "@/services";
import { IoCalendarOutline } from "react-icons/io5";
import { Plus } from "lucide-react";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllEvents } from "@/services/bluma-contract";
import { cn } from "@/lib/utils";

export default function Home() {
  const [events, setEvents] = useState<IEvent[] | undefined>([]);
  const [isFetchingEvents, setIsFetchingEvents] = useState(true);
  const [isActiveTab, setIsActiveTab] = useState<"upcoming" | "past">(
    "upcoming"
  );

  const fetchEvents = async () => {
    setIsFetchingEvents(true);

    try {
      const evt: IEvent[] | any = await getAllEvents();

      setEvents(evt);
    } catch (error: any) {
      console.log("COULD NOT FETCH EVENT", error);
    } finally {
      setIsFetchingEvents(false);
    }
  };

  useEffect(() => {
    document.title = `Events ・ ${site.name}`;
    fetchEvents();

    (async () => {
      const contract = await getBlumaContracts();

      contract.on(
        "EventCreated",
        async (_totalEventsId: any, _seatNumber: any, _capacity: any) => {
          await fetchEvents();
        }
      );

      return () => {
        contract.removeAllListeners("EventCreated");
      };
    })();
  }, []);

  const filteredEvents = () => {
    if (isActiveTab === "upcoming") {
      return (
        events &&
        events
          ?.filter((event) => event.eventStatus !== "CLOSE")
          .sort((a, b) => b.eventId - a.eventId)
      );
    } else {
      return (
        events &&
        events
          ?.filter((event) => event.eventStatus === "CLOSE")
          .sort((a, b) => b.eventId - a.eventId)
      );
    }
  };

  return (
    <div className="flex-1 h-full">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-xl md:text-2xl">Events</h1>

        <div className="bg-secondary/50 p-[2px] rounded-lg flex items-center">
          <div
            onClick={() => setIsActiveTab("upcoming")}
            className={cn(
              "py-1.5 px-3 rounded-md text-xs text-center font-semibold cursor-pointer w-[83px] transition-colors",
              {
                "bg-secondary": isActiveTab === "upcoming",
              }
            )}>
            Upcoming
          </div>
          <div
            onClick={() => setIsActiveTab("past")}
            className={cn(
              "py-1.5 px-3 rounded-md text-xs text-center font-semibold cursor-pointer w-[83px] transition-colors",
              {
                "bg-secondary": isActiveTab === "past",
              }
            )}>
            Past
          </div>
        </div>
      </div>
      <div className="mt-6 md:mt-12 flex flex-col h-full">
        {isFetchingEvents ? (
          Array.from({ length: 5 }).map((_, _key) => (
            <div
              className="flex items-start flex-col md:flex-row w-full gap-4 md:gap-6 group"
              key={_key}>
              <div className="flex-1 h-full hidden sm:block md:sticky md:top-20">
                <div className="relative font-semibold text-sm sm:text-base md:pb-10 flex flex-col gap-2">
                  <Skeleton className="w-28 h-4" />
                  <Skeleton className="w-16 h-4" />
                  <span className="hidden md:flex absolute top-0 -right-[5.5px] size-2.5 rounded-full bg-secondary" />
                  <span className="hidden md:flex absolute top-0 -right-px w-px bg-gradient-to-b from-secondary via-secondary/30 to-transparent h-[200px]" />
                </div>
              </div>

              <div className="mb-10 max-w-full md:max-w-[612px] w-full">
                <div className="w-full h-max rounded-xl border p-3 bg-secondary/50 flex flex-col sm:flex-row items-start justify-between gap-4 md:gap-6">
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
        ) : events?.length === 0 ? (
          <div className="flex items-center justify-center flex-col py-28">
            <IoCalendarOutline className="text-muted-foreground mb-2 sm:mb-4 opacity-50 size-24 sm:size-28" />
            {isActiveTab === "upcoming" ? (
              <>
                <h1 className="text-base md:text-xl font-bold">
                  No Upcoming Events
                </h1>
                <p className="text-muted-foreground text-sm text-center">
                  You have no upcoming events. <br className="flex sm:hidden" />{" "}
                  Why not host one?
                </p>
              </>
            ) : (
              isActiveTab === "past" && (
                <>
                  <h1 className="text-base md:text-xl font-bold">
                    No Past Events
                  </h1>
                  <p className="text-muted-foreground text-sm text-center">
                    No event has been created yet.{" "}
                    <br className="flex sm:hidden" /> Why not host one?
                  </p>
                </>
              )
            )}
            <Button variant="secondary" className="mt-4 pl-3" asChild>
              <Link href="/create" className="flex items-center">
                <Plus size={16} className="mr-2" />
                Create Event
              </Link>
            </Button>
          </div>
        ) : (
          filteredEvents()?.map((event: IEvent) => (
            <EventCard event={event} key={event.eventId} />
          ))
        )}
      </div>
    </div>
  );
}
