"use client";

import moment from "moment";
import { Button } from "@/components/ui/button";
import { EnEvent, EnStatus } from "@/enums";
import {
  calculateDateDifference,
  cn,
  formatDate,
  formatReadableDate,
  getExpiryDate,
  getStatus,
  shortenAddress,
  uploadBannerToPinata,
} from "@/lib/utils";
import { getBlumaContracts } from "@/services";
import {
  createSpace,
  getAllTicketsOfAnEvent,
  getEventById,
  getGroupMembersOfAnEvent,
  joinGroup,
  mintNFT,
  mintNFTsForAttendees,
  purchaseFreeTicket,
  purchasePaidTicket,
  refundFee,
  withdrawEventFee,
} from "@/services/bluma-contract";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MdPayments } from "react-icons/md";
import { Input } from "@/components/ui/input";
import {
  Locate,
  Loader,
  Info,
  UploadIcon,
  X,
  Clock,
  Coins,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import LoadDetails from "@/components/shared/load-details";
import { format } from "date-fns";
import { PiWechatLogoDuotone } from "react-icons/pi";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { useGlobalContext } from "@/providers/global-provider";
import { SiBitly, SiGooglemeet } from "react-icons/si";
import { TbBrandYoutubeFilled } from "react-icons/tb";
import { HiStatusOnline } from "react-icons/hi";
import { RiNftLine, RiShareForward2Fill } from "react-icons/ri";
import { MintingNFT } from "@/constants";
import {
  emitEventNotification,
  handlePayWithStripe,
  purchaseTicketSuccessEmail,
} from "@/services/renderNotification";
import PayWithStripe from "@/components/shared/pay-with-stripe";
import { BsStripe } from "react-icons/bs";

export default function EventDetails({ params }: { params: { id: number } }) {
  const { credentials } = useGlobalContext();

  const [isFetchingEventDetails, setIsFetchingEventDetails] =
    useState<boolean>(true);
  const [event, setEvent] = useState<IEvent | undefined>();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isPurchasingWithStripe, setIsPurchasingWithStripe] = useState(false);
  const [numTicket, setNumTicket] = useState();
  const [ticketBuyers, setTicketBuyers] = useState<any[] | undefined>([]);
  const [hasJoinedGroup, setHasJoinedGroup] = useState(false);
  const [hasBoughtTicket, setHasBoughtTicket] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [locationType, setLocationType] = useState("offline");

  const fetchEventData = async (eventId: number) => {
    try {
      const event = await getEventById(eventId);
      const allTickets = await getAllTicketsOfAnEvent(eventId);

      if (event) {
        setEvent(event);

        console.log(event);

        if (event?.location.includes("meet.google.com")) {
          setLocationType("google");
        } else if (event?.location.includes("youtube.com")) {
          setLocationType("youtube");
        } else if (event?.location.includes("bit.ly")) {
          setLocationType("bitly");
        } else if (event?.location.includes("https://" || "http://")) {
          setLocationType("online");
        } else {
          setLocationType("offline");
        }

        const isAdmin =
          event?.owner?.address.toLowerCase().toString() ===
          credentials?.address.toLowerCase().toString();
        setIsAdmin(isAdmin);

        // Filter out the admin from the ticket buyers
        const nonAdminTicketBuyers = allTickets.filter(
          (ticket: any) =>
            ticket.buyer.toLowerCase() !== event?.owner?.address.toLowerCase()
        );

        // Set the ticket buyers excluding the admin
        setTicketBuyers(nonAdminTicketBuyers);

        // Check if the current user has bought a ticket
        const hasBoughtTicket = nonAdminTicketBuyers.some(
          (ticket: any) =>
            ticket.buyer.toLowerCase() === credentials?.address.toLowerCase()
        );
        setHasBoughtTicket(hasBoughtTicket);
      }

      // Get event group members
      const members = await getGroupMembersOfAnEvent(eventId);
      if (members) {
        // Check if current user is in the group
        const isMemberInGroup = members.some(
          (member: any) =>
            member.address.toLowerCase() === credentials?.address.toLowerCase()
        );
        setHasJoinedGroup(isMemberInGroup);
      }

      return true;
    } catch (error: any) {
      console.log("FAILED TO FETCH EVENT:", error);
    }
  };

  useEffect(() => {
    (async () => {
      setIsFetchingEventDetails(true);
      try {
        const data = await fetchEventData(Number(params?.id));
        if (data) {
          setIsFetchingEventDetails(false);
        }
      } catch (error: any) {
        console.log("FAILED TO FETCH EVENT:", error);
      }
    })();
  }, [credentials?.address, params?.id]);

  useEffect(() => {
    (async () => {
      const contract = await getBlumaContracts();

      // TicketPurchased event listener
      contract.on(
        "TicketPurchased",
        async (buyer, _eventId, numberOfTickets) => {
          await fetchEventData(Number(_eventId));
        }
      );

      // RefundIssued event listener
      contract.on(
        "RefundIssued",
        async (buyer, _ticketId, _eventId, amount) => {
          await fetchEventData(Number(_eventId));
        }
      );

      // GroupCreated event listener
      contract.on("GroupCreated", async (_roomId, imageUrl, _title) => {
        await fetchEventData(Number(_roomId));
      });

      // GroupJoinedSuccessfully event listener
      contract.on(
        "GroupJoinedSuccessfully",
        async (_sender, _eventId, _joinedTimw) => {
          await fetchEventData(Number(_eventId));
        }
      );

      return () => {
        contract.removeAllListeners("TicketPurchased");
        contract.removeAllListeners("RefundIssued");
        contract.removeAllListeners("GroupCreated");
        contract.removeAllListeners("GroupJoinedSuccessfully");
      };
    })();
  }, []);

  const purchaseTicketProps: any = {
    eventId: params?.id,
    isPurchasing,
    setIsPurchasing,
    isPurchasingWithStripe,
    setIsPurchasingWithStripe,
    setNumTicket,
    numTicket,
    seats: event?.seats,
    capacity: event?.capacity,
    eventType: event?.eventType,
    purchaserEmail: credentials?.email,
    creatorEmail: event?.owner?.email,
    title: event?.title,
    location: event?.location,
    ticketPrice: event?.ticketPrice,
  };

  const joinGroupProps: any = {
    eventId: params?.id,
    title: event?.title,
  };

  if (isFetchingEventDetails) return <LoadDetails />;

  return (
    <div className="flex flex-col md:flex-row gap-12 md:gap-8">
      <div className="flex flex-col gap-4 max-w-full md:max-w-[350px] w-full h-max md:sticky md:top-[86px]">
        <div className="w-full bg-secondary/50 rounded-xl aspect-square relative">
          <Image
            src={`https://blue-quickest-opossum-600.mypinata.cloud/ipfs/${
              event?.imageUrl ||
              "Qmcqo1eiTAcXwv3ZYTrEsjz8VkRVTPmqkCPFZNcowF3QQJ"
            }`}
            alt="banner"
            width={350}
            height={350}
            priority
            className="rounded-[inherit] size-full pointer-events-none"
          />
        </div>

        <div className="hidden sm:flex flex-col gap-6">
          {!isAdmin && (
            <div className="flex flex-col w-full">
              <p className="text-muted-foreground text-sm font-medium mb-4 pb-2 border-b">
                Hosted By
              </p>

              <Link
                href={`/profile/${event?.owner?.address}`}
                className="text-sm flex items-center gap-2 w-max group"
              >
                <span className="size-5 bg-secondary rounded-full border relative">
                  <Image
                    alt={event?.owner?.address as string}
                    src={
                      `https://blue-quickest-opossum-600.mypinata.cloud/ipfs/${event?.owner?.avatar || "QmZVMhaKF2e3fQMD8Yzbq7Kx6WrgEwZH3EvqbaJ8UGQbiV"}`}
                    width={20}
                    height={20}
                    priority
                    className="size-full rounded-full"
                  />
                </span>
                <b className="group-hover:underline">
                  {shortenAddress(event?.owner?.address as string)}
                </b>
              </Link>
            </div>
          )}

          <div className="flex flex-col w-full">
            <p className="text-muted-foreground text-sm font-medium mb-4 pb-2 border-b">
              {!ticketBuyers
                ? "None signed up."
                : `${ticketBuyers?.length} ${
                    event?.eventStatus === "CLOSE" ? "Attended" : "Going"
                  }`}
            </p>

            <div className="flex flex-col">
              <div className="flex items-center">
                {ticketBuyers?.slice(0, 6)?.map((member) => (
                  <span
                    className="size-8 bg-secondary rounded-full relative border-4 border-background first:-ml-1 -ml-3"
                    key={member?.email}
                  >
                    <Image
                      alt={member?.address as string}
                      src={
                        `https://blue-quickest-opossum-600.mypinata.cloud/ipfs/${member?.avatar || "QmZVMhaKF2e3fQMD8Yzbq7Kx6WrgEwZH3EvqbaJ8UGQbiV"}` ||
                        `https://bronze-gigantic-quokka-778.mypinata.cloud/ipfs/${member?.avatar}`
                      }
                      width={32}
                      height={32}
                      priority
                      className="size-full rounded-full"
                    />
                  </span>
                ))}
              </div>

              {ticketBuyers && ticketBuyers.length > 0 ? (
                <p className="text-sm font-medium">
                  {ticketBuyers.length === 1 ? (
                    <>
                      <Link
                        href={`/profile/${ticketBuyers[0]?.address}`}
                        className="font-semibold"
                      >
                        {shortenAddress(ticketBuyers[0]?.address)}
                      </Link>{" "}
                      only.
                    </>
                  ) : ticketBuyers.length === 2 ? (
                    <>
                      <Link
                        href={`/profile/${ticketBuyers[0]?.address}`}
                        className="font-semibold"
                      >
                        {shortenAddress(ticketBuyers[0]?.address)}
                      </Link>{" "}
                      and{" "}
                      <Link
                        href={`/profile/${ticketBuyers[1]?.address}`}
                        className="font-semibold"
                      >
                        {shortenAddress(ticketBuyers[1]?.address)}
                      </Link>{" "}
                      only.
                    </>
                  ) : (
                    <>
                      <Link
                        href={`/profile/${ticketBuyers[0]?.address}`}
                        className="font-semibold"
                      >
                        {shortenAddress(ticketBuyers[0]?.address)}
                      </Link>{" "}
                      and{" "}
                      <Link
                        href={`/profile/${ticketBuyers[1]?.address}`}
                        className="font-semibold"
                      >
                        {shortenAddress(ticketBuyers[1]?.address)}
                      </Link>{" "}
                      and {ticketBuyers.length - 2} others.
                    </>
                  )}
                </p>
              ) : (
                <p className="text-sm font-medium">No one has registered.</p>
              )}
            </div>
          </div>

          {isAdmin && !event?.nftUrl && event?.eventStatus !== "CLOSE" && (
            <div className="flex flex-col w-full">
              <p className="text-muted-foreground text-sm font-medium mb-4 pb-2 border-b">
                Mint NFT to participants
              </p>

              <MintingNFTPopup
                eventUri={event?.nftUrl!}
                creator={event?.owner}
                ticketBuyers={ticketBuyers}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 h-max flex flex-col gap-4 md:gap-6">
        <h1 className="w-full border border-x-0 text-2xl sm:text-3xl md:text-4xl font-extrabold pt-0 sm:pt-4 py-4 border-t-0 sm:border-t border-y first-letter:uppercase">
          {event?.title}
        </h1>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="size-10 border flex flex-col items-center justify-between pb-1.5 rounded-lg">
              <div className="w-full h-3.5 bg-secondary rounded-t-md flex items-center justify-center">
                <p className="text-[10px]">
                  {moment(event?.eventStartsTime).format("MMM")}
                </p>
              </div>
              <span className="text-xs sm:text-sm">
                {moment(event?.eventStartsTime).format("D")}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm sm:text-base text-foreground">
                {moment(event?.eventStartsTime).format("dddd")},{" "}
                {moment(event?.eventStartsTime).format("MMMM Do")}
              </span>
              <span className="text-xs text-muted-foreground">
                {moment(event?.eventEndsTime).format("dddd")},{" "}
                {moment(event?.eventEndsTime).format("MMMM Do")}
              </span>
            </div>
          </div>

          <div className="flex justify-start items-center gap-3">
            <div className="size-10 border flex items-center justify-center rounded-lg text-foreground/50">
              {locationType === "google" ? (
                <SiGooglemeet
                  size={20}
                  className="text-sm text-muted-foreground min-w-[18px]"
                />
              ) : locationType === "youtube" ? (
                <TbBrandYoutubeFilled size={20} />
              ) : locationType === "bitly" ? (
                <SiBitly size={20} />
              ) : locationType === "https://" || locationType === "http://" ? (
                <HiStatusOnline size={20} />
              ) : (
                locationType === "offline" && <Locate size={20} />
              )}
            </div>

            {locationType === "offline" ? (
              <p className="text-sm sm:text-base text-foreground leading-none">
                {event?.location}
              </p>
            ) : (
              <Link
                href={event?.location!}
                target="_blank"
                className="text-sm sm:text-base text-foreground leading-none"
              >
                {event?.location}
              </Link>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-secondary/50 flex-1">
          {isAdmin && event?.eventStatus !== "CLOSE" ? (
            <div className="p-3 sm:p-4 flex flex-col gap-1">
              <p className="text-xs md:text-sm font-medium mb-2">
                {event &&
                  (!event.room?.title &&
                  !event.room?.description &&
                  !event.room?.imageUrl
                    ? "Create a room"
                    : event.room.members.length === 1
                    ? "No one has joined your group"
                    : event.room.members.length === 2
                    ? "There's someone in your group, say hello!"
                    : `You have ${
                        event.room.members.length - 1
                      } members in your group`)}
              </p>

              {!event?.room?.title &&
              !event?.room?.description &&
              !event?.room?.imageUrl ? (
                <CreateGroupPopup eventId={event?.eventId!} />
              ) : (
                <Button className="rounded-md" variant="secondary" asChild>
                  <Link
                    href={`/rooms/${event?.room?.eventId}`}
                    className="flex items-center"
                  >
                    <PiWechatLogoDuotone className="mr-2" size={15} />
                    Go to Room
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            isAdmin &&
            event?.eventStatus === "CLOSE" && (
              <div className="p-3 sm:p-4 flex flex-col gap-1">
                <div className="rounded-full size-10 bg-secondary mb-1">
                  <Image
                    alt={credentials?.address as string}
                    src={
                      `https://blue-quickest-opossum-600.mypinata.cloud/ipfs/${credentials?.avatar ||"QmZVMhaKF2e3fQMD8Yzbq7Kx6WrgEwZH3EvqbaJ8UGQbiV"}` ||
                      `https://bronze-gigantic-quokka-778.mypinata.cloud/ipfs/${credentials?.avatar}`
                    }
                    width={40}
                    height={40}
                    priority
                    className="size-full rounded-[inherit]"
                  />
                </div>

                <h1 className="text-base md:text-lg lg:text-xl font-bold">
                  Event has ended
                </h1>

                <p className="text-xs md:text-sm font-medium">
                  Withdraw money earned from event
                </p>

                {event?.room?.members.length > 1 && (
                  <WithdrawFundsPopup eventId={event?.eventId} />
                )}
              </div>
            )
          )}

          {!isAdmin && event?.eventStatus !== "CLOSE" && !hasBoughtTicket ? (
            <div className="flex flex-col p-1">
              <div className="w-full py-2 px-3 bg-secondary rounded-t-lg">
                <p className="text-xs font-medium opacity-50">Registration</p>
              </div>

              <div className="p-3 pb-2 flex flex-col gap-2">
                <p className="text-sm font-semibold">
                  Welcome! To join the event, please purchase a ticket below.
                </p>

                <div className="flex items-center gap-2 mb-2">
                  <span className="size-4 bg-secondary rounded-full relative">
                    <Image
                      alt={credentials?.address as string}
                      src={
                        `https://blue-quickest-opossum-600.mypinata.cloud/ipfs/${credentials?.avatar ||"QmZVMhaKF2e3fQMD8Yzbq7Kx6WrgEwZH3EvqbaJ8UGQbiV"}` ||
                        `https://bronze-gigantic-quokka-778.mypinata.cloud/ipfs/${credentials?.avatar}`
                      }  
                      width={32}
                      height={32}
                      priority
                      className="size-full rounded-[inherit]"
                    />
                  </span>

                  <Link
                    href={`/profile/${credentials?.address}`}
                    className="text-sm font-medium"
                  >
                    {credentials?.email}
                  </Link>
                </div>

                {event?.regStatus === "PENDING" ? (
                  <p className="text-xs md:text-sm font-medium text-muted-foreground italic">
                    Coming soon
                  </p>
                ) : event?.regStatus === "OPEN" ? (
                  <BuyTicketPopup {...purchaseTicketProps}>
                    <Button variant="secondary" className="w-full rounded-md">
                      <MdPayments size={16} className="mr-2" />
                      {event?.eventType === "FREE"
                        ? "Get Ticket"
                        : "Buy Ticket"}
                    </Button>
                  </BuyTicketPopup>
                ) : (
                  <p className="text-xs md:text-sm font-medium text-muted-foreground italic">
                    Closed
                  </p>
                )}
              </div>
            </div>
          ) : !isAdmin && event?.eventStatus !== "CLOSE" && hasBoughtTicket ? (
            <div className="p-3 sm:p-4 flex flex-col gap-1">
              <div className="rounded-full size-10 bg-secondary mb-1">
                <Image
                  alt={credentials?.address as string}
                  src={
                    `https://blue-quickest-opossum-600.mypinata.cloud/ipfs/${credentials?.avatar ||"QmZVMhaKF2e3fQMD8Yzbq7Kx6WrgEwZH3EvqbaJ8UGQbiV"}` ||
                    `https://bronze-gigantic-quokka-778.mypinata.cloud/ipfs/${credentials?.avatar}`
                  }
                  width={40}
                  height={40}
                  priority
                  className="size-full rounded-[inherit]"
                />
              </div>

              <h1 className="text-base md:text-lg lg:text-xl font-bold">
                You&apos; In
              </h1>

              <p className="text-xs md:text-sm font-medium">
                An email has been sent to <b>{credentials?.email}</b>
              </p>

              <div className="w-full py-2 px-3 rounded-lg bg-secondary flex items-start my-2">
                <Clock size={18} className="mr-3 mt-0.5 hidden sm:flex" />

                <div className="flex flex-col flex-1">
                  <p className="flex items-end justify-between w-full border-b border-b-secondary-foreground/20 pb-2 mb-2">
                    <span className="text-sm font-medium">Event starts in</span>
                    <span className="text-sm font-medium text-initial">
                      3h 51m
                    </span>
                  </p>
                  <p className="text-xs font-normal">
                    The join button will be shown when the event is about to
                    start.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                {event &&
                !event.room?.title &&
                !event.room?.description &&
                !event.room?.imageUrl ? (
                  ""
                ) : hasJoinedGroup ? (
                  <Button
                    className="rounded-md w-max"
                    variant="secondary"
                    size="sm"
                    asChild
                  >
                    <Link
                      href={`/rooms/${event?.room?.eventId}`}
                      className="flex items-center"
                    >
                      <PiWechatLogoDuotone className="mr-2" size={15} />
                      Go to Room
                    </Link>
                  </Button>
                ) : (
                  <JoinGroupPopup {...joinGroupProps}>
                    <Button
                      className="rounded-md w-max"
                      variant="secondary"
                      size="sm"
                    >
                      <PiWechatLogoDuotone className="mr-2" size={15} />
                      Join Room
                    </Button>
                  </JoinGroupPopup>
                )}

                <Button
                  className="rounded-md w-max"
                  variant="secondary"
                  size="sm"
                >
                  <RiShareForward2Fill className="mr-2" size={15} />
                  Invite a friend
                </Button>
              </div>
              <CancelRegistration eventId={event?.eventId!} />
            </div>
          ) : (
            !isAdmin &&
            event?.eventStatus === "CLOSE" &&
            hasBoughtTicket && (
              <div className="p-3 sm:p-4 flex flex-col gap-1">
                <div className="rounded-full size-10 bg-secondary mb-1">
                  <Image
                    alt={credentials?.address as string}
                    src={
                      `https://blue-quickest-opossum-600.mypinata.cloud/ipfs/${credentials?.avatar || "QmZVMhaKF2e3fQMD8Yzbq7Kx6WrgEwZH3EvqbaJ8UGQbiV" }` ||
                      `https://bronze-gigantic-quokka-778.mypinata.cloud/ipfs/${credentials?.avatar}`
                    }
                    width={40}
                    height={40}
                    priority
                    className="size-full rounded-[inherit]"
                  />
                </div>

                <h1 className="text-base md:text-lg lg:text-xl font-bold">
                  Thank You for Joining
                </h1>

                <p className="text-xs md:text-sm font-medium">
                  We hope you enjoyed the event!
                </p>
              </div>
            )
          )}

          {/* {event?.eventStatus === "CLOSE" && hasBoughtTicket && !isAdmin ? (
            <div className="p-3 sm:p-4 flex flex-col gap-1">
              <div className="rounded-full size-10 bg-secondary mb-1">
                <Image
                  alt={credentials?.address as string}
                  src={`https://blue-quickest-opossum-600.mypinata.cloud/ipfs/${credentials?.avatar}`}
                  width={40}
                  height={40}
                  priority
                  className="size-full rounded-[inherit]"
                />
              </div>

              <h1 className="text-base md:text-lg lg:text-xl font-bold">
                Thank You for Joining
              </h1>

              <p className="text-xs md:text-sm font-medium">
                We hope you enjoyed the event!
              </p>
            </div>
          ) : hasBoughtTicket && event?.eventStatus !== "CLOSE" && !isAdmin ? (
            <div className="p-3 sm:p-4 flex flex-col gap-1">
              <div className="rounded-full size-10 bg-secondary mb-1">
                <Image
                  alt={credentials?.address as string}
                  src={`https://blue-quickest-opossum-600.mypinata.cloud/ipfs/${credentials?.avatar}`}
                  width={40}
                  height={40}
                  priority
                  className="size-full rounded-[inherit]"
                />
              </div>

              <h1 className="text-base md:text-lg lg:text-xl font-bold">
                You&apos; In
              </h1>

              <p className="text-xs md:text-sm font-medium">
                An email has been sent to <b>{credentials?.email}</b>
              </p>

              <div className="w-full py-2 px-3 rounded-lg bg-secondary flex items-start my-2">
                <Clock size={18} className="mr-3 mt-0.5 hidden sm:flex" />

                <div className="flex flex-col flex-1">
                  <p className="flex items-end justify-between w-full border-b border-b-secondary-foreground/20 pb-2 mb-2">
                    <span className="text-sm font-medium">Event starts in</span>
                    <span className="text-sm font-medium text-initial">
                      3h 51m
                    </span>
                  </p>
                  <p className="text-xs font-normal">
                    The join button will be shown when the event is about to
                    start.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                {event &&
                !event.room?.title &&
                !event.room?.description &&
                !event.room?.imageUrl ? (
                  ""
                ) : hasJoinedGroup ? (
                  <Button
                    className="rounded-md w-max"
                    variant="secondary"
                    size="sm"
                    asChild>
                    <Link
                      href={`/rooms/${event?.room?.eventId}`}
                      className="flex items-center">
                      <PiWechatLogoDuotone className="mr-2" size={15} />
                      Go to Room
                    </Link>
                  </Button>
                ) : (
                  <JoinGroupPopup {...joinGroupProps}>
                    <Button
                      className="rounded-md w-max"
                      variant="secondary"
                      size="sm">
                      <PiWechatLogoDuotone className="mr-2" size={15} />
                      Join Room
                    </Button>
                  </JoinGroupPopup>
                )}

                <Button
                  className="rounded-md w-max"
                  variant="secondary"
                  size="sm">
                  <RiShareForward2Fill className="mr-2" size={15} />
                  Invite a friend
                </Button>
              </div>
              <CancelRegistration />
            </div>
          ) : (
            !isAdmin &&
            event?.eventStatus !== "CLOSE" && (
              <div className="flex flex-col p-1">
                <div className="w-full py-2 px-3 bg-secondary rounded-t-lg">
                  <p className="text-xs font-medium opacity-50">Registration</p>
                </div>

                <div className="p-3 pb-2 flex flex-col gap-2">
                  <p className="text-sm font-semibold">
                    Welcome! To join the event, please purchase a ticket below.
                  </p>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="size-4 bg-secondary rounded-full relative">
                      <Image
                        alt={credentials?.address as string}
                        src={`https://blue-quickest-opossum-600.mypinata.cloud/ipfs/${credentials?.avatar}`}
                        width={32}
                        height={32}
                        priority
                        className="size-full rounded-[inherit]"
                      />
                    </span>

                    <Link
                      href={`/profile/${credentials?.address}`}
                      className="text-sm font-medium">
                      {credentials?.email}
                    </Link>
                  </div>

                  {event?.regStatus === "PENDING" ? (
                    <p className="text-xs md:text-sm font-medium text-muted-foreground italic">
                      Coming soon
                    </p>
                  ) : event?.regStatus === "OPEN" ? (
                    <BuyTicketPopup {...purchaseTicketProps}>
                      <Button variant="secondary" className="w-full rounded-md">
                        <MdPayments size={16} className="mr-2" />
                        {event?.eventType === "FREE"
                          ? "Get Ticket"
                          : "Buy Ticket"}
                      </Button>
                    </BuyTicketPopup>
                  ) : (
                    <p className="text-xs md:text-sm font-medium text-muted-foreground italic">
                      Closed
                    </p>
                  )}
                </div>
              </div>
            )
          )} */}

          {/* //! has canceled registration */}
          {/* <div className="p-3 sm:p-4 flex flex-col gap-1">
            <div className="rounded-full size-10 bg-secondary mb-1">
              <Image
                alt={credentials?.address as string}
                src={`https://blue-quickest-opossum-600.mypinata.cloud/ipfs/${credentials?.avatar}`}
                width={40}
                height={40}
                priority
                className="size-full rounded-[inherit]"
              />
            </div>

            <h1 className="text-base md:text-lg lg:text-xl font-bold">
              You&apos;re Not Going
            </h1>

            <p className="text-xs md:text-sm font-medium">
              We hope to see you next time
            </p>

            <BuyTicketPopup {...purchaseTicketProps}>
              <p className="text-xs font-normal mt-4">
                Changed your mind? You can{" "}
                <b className="text-initial underline cursor-pointer">
                  register again
                </b>
                .
              </p>
            </BuyTicketPopup>
          </div> */}
          {/* //! has canceled registration */}
        </div>

        <div className="flex flex-col w-full">
          <p className="text-muted-foreground text-sm font-medium mb-4 pb-2 border-b">
            About Event
          </p>

          <ReactMarkdown
            className="overflow-hidden leading-6 whitespace-pre-wrap break-words flex-1 text-sm"
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
            {event?.description}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

const WithdrawFundsPopup = ({ eventId }: { eventId: number }) => {
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleWithdrawFee = async () => {
    setIsWithdrawing(true);
    try {
      const result = await withdrawEventFee(eventId);
      if (result) toast.success("Withdrawal successful");
    } catch (error) {
      console.log(error);
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" className="w-full rounded-md mt-2">
          <Coins size={16} className="mr-2" />
          Withdraw
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[360px] w-full border rounded-[20px] backdrop-blur-3xl bg-secondary/60 flex flex-col gap-4">
        <div className="w-full">
          <div className="rounded-full size-16 bg-secondary/80 flex items-center justify-center border">
            <Coins size={36} className="text-muted-foreground" />
          </div>
        </div>

        <h1 className="text-lg md:text-[22px] font-bold">
          Withdraw Event Fees
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground -mt-2">
          We&apos;ll let the host know that you can&apos;t make it.
        </p>

        <Button disabled={isWithdrawing} onClick={handleWithdrawFee}>
          {isWithdrawing ? (
            <>
              <Loader size={16} className="mr-2 animate-spin" />
              Withdrawing...
            </>
          ) : (
            "Confirm"
          )}
        </Button>
        <AlertDialogCancel className="absolute top-2 right-2 p-0 bg-transparent hover:bg-transparent border-0 size-9 rounded-full">
          <X size={16} />
        </AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const CancelRegistration = ({ eventId }: { eventId: number }) => {
  const [isCanceling, setIsCanceling] = useState(false);

  const handleCancelation = async () => {
    setIsCanceling(true);
    try {
      const data = await refundFee(Number(eventId));
      if (data) {
        toast.success("Registration canceled");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsCanceling(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <p className="text-xs font-normal">
          No longer able to attend? Notify the host by{" "}
          <b className="text-initial underline cursor-pointer">
            canceling your registration
          </b>
          .
        </p>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[360px] w-full border rounded-[20px] backdrop-blur-3xl bg-secondary/60 flex flex-col gap-4">
        <div className="w-full">
          <div className="rounded-full size-16 bg-secondary/80 flex items-center justify-center border">
            <PiWechatLogoDuotone size={36} className="text-muted-foreground" />
          </div>
        </div>

        <h1 className="text-lg md:text-[22px] font-bold">
          Cancel Registration
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground -mt-2">
          We&apos;ll let the host know that you can&apos;t make it.
        </p>

        <Button
          disabled={isCanceling}
          onClick={handleCancelation}
          variant="destructive"
        >
          {isCanceling ? (
            <>
              <Loader size={16} className="mr-2 animate-spin" />
              Refunding...
            </>
          ) : (
            "Confirm"
          )}
        </Button>
        <AlertDialogCancel className="absolute top-2 right-2 p-0 bg-transparent hover:bg-transparent border-0 size-9 rounded-full">
          <X size={16} />
        </AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const CreateGroupPopup = ({ eventId }: { eventId: number }) => {
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  const handleCreateGroup = async () => {
    if (!eventId) return;
    setIsCreatingGroup(true);

    try {
      const result = await createSpace(Number(eventId));
      if (result) {
        toast.success("Room has been created! 🎉");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error setting up space!");
    } finally {
      setIsCreatingGroup(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="secondary"
          className="flex-1"
          disabled={isCreatingGroup}
        >
          {isCreatingGroup ? (
            <>
              <Loader size={16} className="mr-2 animate-spin" />
              Please wait...
            </>
          ) : (
            <>
              <PiWechatLogoDuotone size={16} className="mr-2" />
              Create Group
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[360px] w-full border rounded-[20px] backdrop-blur-3xl bg-secondary/60 flex flex-col gap-4">
        <div className="w-full">
          <div className="rounded-full size-16 bg-secondary/80 flex items-center justify-center border">
            <PiWechatLogoDuotone size={36} className="text-muted-foreground" />
          </div>
        </div>

        <h1 className="text-lg md:text-[22px] font-bold">
          Create Space (optional)
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground -mt-2">
          Remember that you may decide whether or not to set up a space for
          attendees.
        </p>

        <Button onClick={handleCreateGroup} disabled={isCreatingGroup}>
          {isCreatingGroup ? (
            <>
              <Loader size={16} className="mr-2 animate-spin" />
              Setting up space...
            </>
          ) : (
            "Create Group"
          )}
        </Button>
        <AlertDialogCancel className="absolute top-2 right-2 p-0 bg-transparent hover:bg-transparent border-0 size-9 rounded-full">
          <X size={16} />
        </AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const MintingNFTPopup = ({
  eventUri,
  creator,
  ticketBuyers,
}: {
  eventUri: string;
  creator: any;
  ticketBuyers: any;
}) => {
  const defaultNFT = "Qmcqo1eiTAcXwv3ZYTrEsjz8VkRVTPmqkCPFZNcowF3QQJ";

  const [eventNFT, setEventNFT] = useState<File>();
  const [isMinting, setIsMinting] = useState<string | boolean>(MintingNFT.STOP);

  const handleMintNFT = async () => {
    let nft: string;

    try {
      if (eventNFT === undefined) {
        nft = defaultNFT;
      } else {
        setIsMinting(MintingNFT.UPLOADING);
        const cover = await uploadBannerToPinata(eventNFT);
        nft = cover;
        setIsMinting(MintingNFT.STOP);
      }

      if (!nft) {
        return toast.error("Could not upload banner to IPFS.");
      }

      setIsMinting(MintingNFT.START);

      const result = await mintNFTsForAttendees(eventUri, ticketBuyers);

      if (result) {
        toast.success("Minted successfully");
      }
    } catch (error: any) {
      console.log(error);
      toast.error("Error minting nft");
    } finally {
      setIsMinting(MintingNFT.STOP);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" className="flex-1">
          {isMinting === MintingNFT.UPLOADING ? (
            <>
              <Loader size={16} className="mr-2 animate-spin" />
              Uploading...
            </>
          ) : isMinting === MintingNFT.START ? (
            <>
              <Loader size={16} className="mr-2 animate-spin" />
              Minting...
            </>
          ) : (
            <>
              <RiNftLine size={16} className="mr-2" />
              Mint NFT
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[360px] w-full border rounded-[20px] backdrop-blur-3xl bg-secondary/60 flex flex-col gap-4">
        <div className="w-full">
          <div className="rounded-full size-16 bg-secondary/80 flex items-center justify-center border">
            <RiNftLine size={36} className="text-muted-foreground" />
          </div>
        </div>

        <h1 className="text-lg md:text-[22px] font-bold">
          Mint NFT (optional)
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground -mt-2">
          Keep in mind that you have the choice to mint the default NFT or to
          mint your NFT for participants.
        </p>

        <>
          <Input
            hidden
            className="hidden opacity-0"
            type="file"
            accept="image/*"
            id="nft"
            onChange={(e: any) => setEventNFT(e.target.files[0])}
            disabled={isMinting !== MintingNFT.STOP}
          />
          <Label
            htmlFor="nft"
            className={cn(
              "aspect-[1.4] border-dashed rounded-lg w-full bg-secondary p-1 cursor-pointer group",
              {
                "border-0 cursor-not-allowed opacity-50":
                  isMinting !== MintingNFT.STOP,
              }
            )}
          >
            <div className="relative size-full rounded-[inherit] overflow-hidden">
              {isMinting === MintingNFT.STOP && (
                <div className="size-full absolute top-0 left-0 select-none pointer-events-none opacity-0 group-hover:opacity-100 duration-300 flex items-center justify-center bg-background/50 backdrop-blur-xl z-10">
                  <UploadIcon size={48} />
                </div>
              )}
              <Image
                src={
                  eventNFT
                    ? URL.createObjectURL(eventNFT)
                    : `https://blue-quickest-opossum-600.mypinata.cloud/ipfs/${defaultNFT}`
                }
                alt="event-nft"
                fill
                priority
                className="size-full object-cover"
              />
            </div>
          </Label>
        </>

        <Button onClick={handleMintNFT}>
          {isMinting === MintingNFT.UPLOADING ? (
            <>
              <Loader size={16} className="mr-2 animate-spin" />
              Uploading...
            </>
          ) : isMinting === MintingNFT.START ? (
            <>
              <Loader size={16} className="mr-2 animate-spin" />
              Minting...
            </>
          ) : (
            "Mint"
          )}
        </Button>
        <AlertDialogCancel className="absolute top-2 right-2 p-0 bg-transparent hover:bg-transparent border-0 size-9 rounded-full">
          <X size={16} />
        </AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const BuyTicketPopup = ({
  eventId,
  isPurchasing,
  setIsPurchasing,
  isPurchasingWithStripe,
  setIsPurchasingWithStripe,
  numTicket,
  setNumTicket,
  seats,
  capacity,
  eventType,
  children,
  purchaserEmail,
  creatorEmail,
  title,
  location,
  ticketPrice,
}: {
  eventId: number;
  setIsPurchasing: any;
  isPurchasing: boolean;
  setIsPurchasingWithStripe: any;
  isPurchasingWithStripe: boolean;
  numTicket: number;
  setNumTicket: any;
  seats: number;
  capacity: number;
  eventType: string;
  children: React.ReactNode;
  purchaserEmail: string;
  creatorEmail: string;
  title: string;
  location: string;
  ticketPrice: number;
}) => {
  const router = useRouter();
  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!numTicket) {
      toast.info("Please provide the number of tickets.");
      return;
    } else if (numTicket < 1) {
      toast.info("You need to purchase at least 1 ticket");
      return;
    } else if (numTicket > 5) {
      toast.info("You can only purchase at most 5 tickets");
      return;
    } else if (Number(numTicket) + seats > capacity) {
      toast.info("Not enough seats available");
      return;
    }

    setIsPurchasing(true);
    try {
      let someonePurchaseTicket;
      console.log(eventType);
      if (eventType === "FREE") {
        someonePurchaseTicket = await purchaseFreeTicket(
          Number(eventId),
          Number(numTicket)
        );
      }
      if (eventType === "PAID") {
        someonePurchaseTicket = await purchaseFreeTicket(
          Number(eventId),
          Number(numTicket)
        );
      }

      if (someonePurchaseTicket) {
        const result = await purchaseTicketSuccessEmail(
          purchaserEmail,
          creatorEmail,
          title,
          Number(numTicket),
          location
        );

        if (result) {
          emitEventNotification({
            title: "Ticket purchased",
            description: `Transaction confirmed! You now have ${numTicket} tickets`,
          });
        } else {
          console.log(
            "There was an error processing the ticket purchase and/or notification."
          );
        }
        toast.success("You now have a space in this event.");
        setIsPurchasing(false);
      }
    } catch (error: any) {
      console.log("FAILED TO PURCHASE TICKET:", error);
      setIsPurchasing(false);
    }
  }

  async function handleStripePayment() {
    if (!numTicket) {
      toast.info("Please provide the number of tickets.");
      return;
    } else if (numTicket < 1) {
      toast.info("You need to purchase at least 1 ticket");
      return;
    } else if (numTicket > 5) {
      toast.info("You can only purchase at most 5 tickets");
      return;
    } else if (Number(numTicket) + seats > capacity) {
      toast.info("Not enough seats available");
      return;
    }
    setIsPurchasingWithStripe(true);
    try {
      const amount = Number(numTicket) * Number(ticketPrice);
      const stripeResult = await handlePayWithStripe(
        amount,
        title,
        Number(numTicket),
        `https://bluma-protocol-frontend.vercel.app/event/event-payment-success?eventId=${eventId}&numTicket=${numTicket}&title=${title}&location=${location}&purchaserEmail=${purchaserEmail}&creatorEmail=${creatorEmail}`
      );

      if (stripeResult) {
        router.push(stripeResult.toString());
      }
    } catch (error) {
      console.error("Failed to purchase ticket:", error);
      setIsPurchasingWithStripe(false);
    } finally {
      setIsPurchasingWithStripe(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild disabled={isPurchasing}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[360px] w-full border rounded-[20px] backdrop-blur-3xl bg-secondary/60 flex flex-col gap-4">
        <div className="w-full">
          <div className="rounded-full size-16 bg-secondary/80 flex items-center justify-center border">
            <MdPayments size={36} className="text-muted-foreground" />
          </div>
        </div>

        <h1 className="text-lg md:text-[22px] font-bold">Purchase Ticket</h1>
        <p className="text-xs md:text-sm text-muted-foreground -mt-2">
          {eventType === "FREE"
            ? "You will not be charged for the ticket"
            : "You will be charged for the ticket"}
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-1">
          <div className="flex flex-col gap-1">
            <Label>Number of Tickets</Label>

            <Input
              onChange={(e: any) => setNumTicket(e.target.value)}
              placeholder="3 Tickets"
              className="h-10"
              type="number"
              min={1}
              max={5}
              disabled={isPurchasing}
            />
          </div>
          <Label className="text-xs italic">
            Seats Left: {capacity - seats}
          </Label>
          <Button
            disabled={isPurchasing || seats >= capacity}
            type="submit"
            className="mt-3"
          >
            {isPurchasing ? (
              <>
                <Loader size={16} className="animate-spin mr-2" />
                Please wait...
              </>
            ) : eventType === "FREE" ? (
              "Get Ticket"
            ) : (
              "Buy Ticket"
            )}
          </Button>

          <Button
            variant="outline"
            className="flex rounded-lg mt-3 items-center space-x-2"
            onClick={(e) => {
              e.preventDefault();
              handleStripePayment();
            }}
          >
            {isPurchasingWithStripe ? (
              <>
                <Loader size={16} className="animate-spin mr-2" />
                Please wait...
              </>
            ) : (
              <span className="flex items-center">
                <BsStripe size={18} />
                <span className="ml-2">Pay with Stripe</span>
              </span>
            )}
          </Button>

          <AlertDialogCancel className="absolute top-2 right-2 p-0 bg-transparent hover:bg-transparent border-0 size-9 rounded-full">
            <X size={16} />
          </AlertDialogCancel>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const JoinGroupPopup = ({
  eventId,
  children,
}: {
  eventId: number;
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [isJoining, setIsJoining] = useState(false);

  const handleJoiningGroup = async () => {
    setIsJoining(true);
    try {
      const joined = await joinGroup(Number(eventId));

      if (joined) {
        toast.success("Successfully joined group");
        router.push(`/rooms/${Number(eventId)}`);
      }
    } catch (error: any) {
      console.log("FAILED TO JOIN GROUP:", error);
    } finally {
      setIsJoining(false);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-[360px] w-full border rounded-[20px] backdrop-blur-3xl bg-secondary/60 flex flex-col gap-4">
        <div className="w-full">
          <div className="rounded-full size-16 bg-secondary/80 flex items-center justify-center border">
            <PiWechatLogoDuotone size={36} className="text-muted-foreground" />
          </div>
        </div>

        <h1 className="text-lg md:text-[22px] font-bold">Join Space</h1>

        <p className="text-xs md:text-sm text-muted-foreground -mt-2">
          Before the event begins, join the conversation to learn more about it
          and meet new people.
        </p>

        <Button onClick={handleJoiningGroup} disabled={isJoining}>
          {isJoining ? (
            <>
              <Loader size={16} className="mr-2 animate-spin" />
              Joining...
            </>
          ) : (
            "Join"
          )}
        </Button>
        <AlertDialogCancel className="absolute top-2 right-2 p-0 bg-transparent hover:bg-transparent border-0 size-9 rounded-full">
          <X size={16} />
        </AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialog>
  );
};
