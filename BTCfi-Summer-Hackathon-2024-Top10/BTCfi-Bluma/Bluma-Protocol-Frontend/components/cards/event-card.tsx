"use client";

import { cn, shortenAddress } from "@/lib/utils";
import { useGlobalContext } from "@/providers/global-provider";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";
import moment from "moment";
import ReactMarkdown from "react-markdown";

export default function EventCard({
  event,
  hide,
  compact,
}: {
  event: IEvent;
  hide?: boolean;
  compact?: boolean;
}) {
  const { credentials } = useGlobalContext();

  const {
    eventId,
    title,
    imageUrl,
    description,
    owner,
    regStatus,
    eventStatus,
    eventType,
    eventStartsTime,
    eventEndsTime,
    ticketPrice,
  } = event && event;

  return compact ? (
    <Link
      href={`/event/${eventId}`}
      className="flex flex-col w-full sm:hover:bg-secondary/50 sm:rounded-lg transition-opacity mb-4 last:mb-0 sm:mb-0 sm:p-4"
    >
      <div className="pb-2 mb-2 border-b">
        <p className="text-sm font-medium text-muted-foreground">
          {eventStatus === "OPEN" ? (
            <>Starts {moment(eventStartsTime).endOf("day").fromNow()}</>
          ) : eventStatus === "PENDING" ? (
            <>
              {moment(eventStartsTime).format("MMMM Do YYYY")} -{" "}
              {moment(eventEndsTime).format("MMMM Do YYYY")}
            </>
          ) : (
            "Event has ended"
          )}
        </p>
      </div>

      <div className="flex items-start flex-col gap-2 sm:gap-0 sm:flex-row">
        <div className="flex items-start gap-2 size-full max-w-24 sm:max-w-28 mt-px">
          {regStatus === "PENDING" ? (
            <Badge variant="pending" className="w-max text-xs font-medium">
              Coming Soon
            </Badge>
          ) : regStatus === "OPEN" ? (
            <Badge variant="success" className="w-max text-xs font-medium">
              On Going
            </Badge>
          ) : (
            <Badge variant="destructive" className="w-max text-xs font-medium">
              Ended
            </Badge>
          )}
        </div>

        <div className="flex flex-col flex-1">
          <h1 className="flex items-end justify-between gap-4 w-full">
            <span className="text-sm md:text-base font-medium">{title}</span>

            <span className="text-sm flex items-center font-medium">
              {eventType === "PAID" ? `${ticketPrice} BLUM` : "Free"}
            </span>
          </h1>

          <div className="text-sm flex items-center gap-2 w-max group my-1">
            <span className="size-5 bg-secondary rounded-xl border relative">
              <Image
                alt={owner?.address}
                src={`https://blue-quickest-opossum-600.mypinata.cloud/ipfs/${owner?.avatar}`}
                defaultValue="https://blue-quickest-opossum-600.mypinata.cloud/ipfs/QmZVMhaKF2e3fQMD8Yzbq7Kx6WrgEwZH3EvqbaJ8UGQbiV"
                width={20}
                height={20}
                priority
                className={`size-full rounded-[inherit] ${
                  owner?.avatar ? "rounded-full" : ""
                }`}
              />
            </span>
            <p className="text-sm text-muted-foreground">
              {credentials?.address === owner?.address ? (
                "Hosted by You"
              ) : (
                <>By {shortenAddress(owner?.address)}</>
              )}
            </p>
          </div>

          <ReactMarkdown
            className="overflow-hidden leading-6 whitespace-pre-wrap break-words flex-1 text-sm line-clamp-2"
            components={{
              pre: ({ node, ...props }) => (
                <pre
                  {...props}
                  className="text-sm leading-6 markdown prose w-full break-words"
                />
              ),
              code: ({ node, ...props }) => (
                <code
                  className="text-primary bg-secondary px-1 py-0.5 text-sm markdown prose break-words rounded-sm"
                  {...props}
                />
              ),
            }}
          >
            {description}
          </ReactMarkdown>
        </div>
      </div>
    </Link>
  ) : (
    <div
      className={cn(
        "flex items-start flex-col md:flex-row w-full gap-4 md:gap-6 group",
        {
          "mb-10 last:mb-0": !hide,
          "mb-4 last:mb-0": hide,
        },
      )}
    >
      {!hide && (
        <div className="flex-1 h-full hidden sm:block md:sticky md:top-20">
          <p className="relative font-semibold text-sm sm:text-base md:pb-10">
            {moment(eventStartsTime).format("MMM Do")}
            <br />
            <span className="text-muted-foreground text-xs sm:text-sm font-medium">
              {moment(eventStartsTime).format("dddd")}
            </span>
            <span className="hidden md:flex absolute top-0 -right-[5.5px] size-2.5 rounded-full bg-secondary" />
            <span className="hidden md:flex absolute top-0 -right-px w-px bg-gradient-to-b from-secondary via-secondary/30 to-transparent h-[200px]" />
          </p>
        </div>
      )}

      <Link
        className={cn(
          "max-w-full md:max-w-[612px] w-full transition-transform duration-300 cursor-pointer",
          {
            "group-hover:-translate-y-3": !hide,
          },
        )}
        href={`/event/${eventId}`}
      >
        <div className="w-full rounded-xl border p-3 sm:pl-4 bg-secondary/50 flex flex-col sm:flex-row items-start justify-between gap-4 md:gap-6">
          <div className="flex flex-col flex-1 w-full sm:w-max">
            <p className="text-sm font-medium text-muted-foreground">
              {eventStatus === "OPEN" ? (
                <>Starts {moment(eventStartsTime).endOf("day").fromNow()}</>
              ) : eventStatus === "PENDING" ? (
                <>
                  {moment(eventStartsTime).format("MMMM Do YYYY")} -{" "}
                  {moment(eventEndsTime).format("MMMM Do YYYY")}
                </>
              ) : (
                "Event has ended"
              )}
            </p>

            <h1 className="my-1 text-base md:text-lg font-semibold line-clamp-1">
              {title}
            </h1>

            <div className="text-sm flex items-center gap-2 w-max group">
              <span className="size-5 bg-secondary rounded-xl border relative">
                <Image
                  alt={owner?.address}
                  src={
                    `https://blue-quickest-opossum-600.mypinata.cloud/ipfs/${owner?.avatar}` ||
                    `https://blue-quickest-opossum-600.mypinata.cloud/ipfs/QmZVMhaKF2e3fQMD8Yzbq7Kx6WrgEwZH3EvqbaJ8UGQbiV`
                  }
                  defaultValue="https://blue-quickest-opossum-600.mypinata.cloud/ipfs/QmZVMhaKF2e3fQMD8Yzbq7Kx6WrgEwZH3EvqbaJ8UGQbiV"
                  width={20}
                  height={20}
                  priority
                  className={`size-full rounded-[inherit] ${
                    owner?.avatar ? "rounded-full" : ""
                  }`}
                />
              </span>
              <b>
                {credentials?.address === owner?.address ? (
                  "Hosted by You"
                ) : (
                  <>
                    {hide ? "Owned by" : "Hosted by"}{" "}
                    {shortenAddress(owner?.address)}
                  </>
                )}
              </b>
            </div>

            {/* //? SEPARATOR */}
            <div className="my-2 py-2 flex-1 flex flex-col">
              <span className="w-full h-px bg-secondary" />
            </div>
            {/* //? SEPARATOR */}

            <div className="mb-1 flex items-center gap-2">
              <p className="text-sm flex items-center font-medium text-muted-foreground">
                Ticket Price:
              </p>
              <p className="text-sm flex items-center font-medium">
                {eventType === "PAID" ? `${ticketPrice} BLUM` : "Free"}
              </p>
            </div>

            <div className="mt-auto flex gap-2 items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Registration:
              </span>
              {regStatus === "PENDING" ? (
                <Badge variant="pending" className="w-max text-xs font-medium">
                  Coming Soon
                </Badge>
              ) : regStatus === "OPEN" ? (
                <Badge variant="success" className="w-max text-xs font-medium">
                  On Going
                </Badge>
              ) : (
                <Badge
                  variant="destructive"
                  className="w-max text-xs font-medium"
                >
                  Ended
                </Badge>
              )}
            </div>
          </div>

          <div className="bg-background/50 w-full sm:w-[155px] aspect-[1.2] sm:aspect-square rounded-lg overflow-hidden">
            <Image
              src={
                `https://blue-quickest-opossum-600.mypinata.cloud/ipfs/${imageUrl}` ||
                `https://blue-quickest-opossum-600.mypinata.cloud/ipfs/Qmcqo1eiTAcXwv3ZYTrEsjz8VkRVTPmqkCPFZNcowF3QQJ`
              }
              defaultValue="https://blue-quickest-opossum-600.mypinata.cloud/ipfs/Qmcqo1eiTAcXwv3ZYTrEsjz8VkRVTPmqkCPFZNcowF3QQJ"
              alt={title}
              priority
              width={147}
              height={147}
              className="object-cover size-full"
            />
          </div>
        </div>
      </Link>
    </div>
  );
}
