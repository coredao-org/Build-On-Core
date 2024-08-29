"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createEventSchema } from "@/lib/validators";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Globe, Loader, ScrollText, Sofa } from "lucide-react";
import { useEffect, useState } from "react";
import { CreatingEvent, bannerCIDs } from "@/constants";
import Image from "next/image";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { generateDescription, uploadBannerToPinata } from "@/lib/utils";
import { ImCoinDollar } from "react-icons/im";
import { SiBitly } from "react-icons/si";
import { SiGooglemeet } from "react-icons/si";
import { TbBrandYoutubeFilled } from "react-icons/tb";
import { HiStatusOnline, HiStatusOffline } from "react-icons/hi";
import { GrMapLocation } from "react-icons/gr";
import { LiaRandomSolid } from "react-icons/lia";
import { RiNftLine } from "react-icons/ri";

import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { MdOutlineReduceCapacity } from "react-icons/md";
import { createEvent } from "@/services/bluma-contract";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import { FaCircle, FaRegCircle } from "react-icons/fa";
import { LuTicket } from "react-icons/lu";
import { TfiWrite } from "react-icons/tfi";
import { MdOutlineShareLocation } from "react-icons/md";
import { useGlobalContext } from "@/providers/global-provider";
import LoadDetails from "@/components/shared/load-details";
import { createEventSuccessEmail } from "@/services/renderNotification";
import { BsImage } from "react-icons/bs";
import { Label } from "@/components/ui/label";

export default function CreateEventPage() {
  const router = useRouter();

  const { credentials, isFetchingUser } = useGlobalContext();

  const [registration, setRegistration] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [eventDate, setEventDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [bannerUrl, setBannerUrl] = useState<File>();
  const [prompt, setPrompt] = useState("");
  const [description, setDescription] = useState("");
  const [randomBannerCID, setRandomBannerCID] = useState<string>(bannerCIDs[5]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [openSuggestionBox, setOpenSuggestionBox] = useState(false);
  const [isEventFree, setIsEventFree] = useState(true);
  const [isEventOnline, setIsEventOnline] = useState(true);
  const [isEventUnlimited, setIsEventUnlimited] = useState(true);
  const [isCreating, setIsCreating] = useState<string | boolean>(
    CreatingEvent.STOP
  );

  const form = useForm<z.infer<typeof createEventSchema>>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      ticketCost: isEventFree ? 1 : 0,
      location: "https://bit.ly/4bQYpoO",
      capacity: 10,
    },
  });

  async function onSubmit(values: z.infer<typeof createEventSchema>) {
    let banner;

    try {
      if (bannerUrl === undefined) {
        banner = randomBannerCID;
      } else {
        setIsCreating(CreatingEvent.UPLOADING);
        const cover = await uploadBannerToPinata(bannerUrl);
        banner = cover;
        setIsCreating(CreatingEvent.STOP);
      }

      const refinedValues: ICreateEvent = {
        title: values.title,
        imageUrl: banner,
        description: description,
        location: values.location,
        capacity: Number(isEventUnlimited ? 50000 : values.capacity),
        regStartsTime: new Date(registration?.from as any).getTime(),
        regEndsTime: new Date(registration?.to as any).getTime(),
        eventStartsTime: new Date(eventDate?.from as any).getTime(),
        eventEndsTime: new Date(eventDate?.to as any).getTime(),
        ticketPrice: Number(isEventFree ? 0 : values.ticketCost),
      };

      if (refinedValues.description.length < 5) {
        return toast.error("Description must be at least 5 characters.");
      }
      if (!refinedValues.location) {
        return toast.error("Choose a venue for your event.", {
          description: "You need to provide a location for your event.",
        });
      }
      if (!refinedValues.regStartsTime || !refinedValues.regEndsTime) {
        return toast.error("Provide the registration dates.", {
          description: "Users must know when registration opens and closes.",
        });
      }
      if (!refinedValues.eventStartsTime || !refinedValues.eventEndsTime) {
        return toast.error("Provide the event dates.", {
          description:
            "Users need to know the start and end times of your event.",
        });
      }
      if (!refinedValues.imageUrl) {
        return toast.error("Could not upload banner to IPFS.");
      }

      setIsCreating(CreatingEvent.START);

      const result = await createEvent(refinedValues);

      if (result) {
        await createEventSuccessEmail(
          credentials?.email!,
          refinedValues?.title,
          refinedValues?.location
        );
        toast.success("Event created successfully");
        form.reset();
        router.push("/home");
      }
    } catch (error: any) {
      console.log(error);
      toast.error("Error creating event");
    } finally {
      setIsCreating(CreatingEvent.STOP);
    }
  }

  const handleGenerateDescription = async () => {
    if (prompt === "" || prompt.length <= 3) {
      setOpenSuggestionBox(false);
      return toast.error("Prompt must be greater than 3 characters");
    }
    setIsGenerating(true);
    try {
      const result = await generateDescription(prompt);
      if (result) {
        setDescription(result.trim());
        setPrompt("");
        setOpenSuggestionBox(false);
        toast.success("Successfully generated description");
        return;
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate description");
    } finally {
      setIsGenerating(false);
    }
  };

  const getRandomBanner = () => {
    const randomIndex = Math.floor(Math.random() * bannerCIDs.length);
    setRandomBannerCID(bannerCIDs[randomIndex]);
  };

  useEffect(() => {
    return () => getRandomBanner();
  }, []);

  if (isFetchingUser) return <LoadDetails />;

  return (
    <div className="flex flex-col md:flex-row gap-12 md:gap-8">
      <div className="flex flex-col gap-4 md:gap-6 max-w-full md:max-w-[350px] w-full h-max">
        <div className="w-full bg-secondary/50 rounded-xl aspect-square relative">
          {isCreating === CreatingEvent.UPLOADING && (
            <div className="absolute bg-background/50 backdrop-blur-sm rounded-[inherit] size-full top-0 left-0 z-10 flex items-center justify-center">
              <Loader size={30} className="animate-spin" />
            </div>
          )}
          <Image
            src={
              bannerUrl
                ? URL.createObjectURL(bannerUrl)
                : `https://blue-quickest-opossum-600.mypinata.cloud/ipfs/${randomBannerCID}`
            }
            alt="banner"
            fill
            priority
            sizes="auto"
            className={cn("rounded-[inherit] size-full pointer-events-none", {
              "opacity-50 cursor-not-allowed":
                isCreating !== CreatingEvent.STOP || !credentials,
            })}
          />
          {isCreating === CreatingEvent.STOP && (
            <>
              <Input
                hidden
                className="hidden opacity-0"
                type="file"
                accept="image/*"
                id="banner"
                onChange={(e: any) => setBannerUrl(e.target.files[0])}
                disabled={isCreating !== CreatingEvent.STOP || !credentials}
              />
              <Label
                htmlFor="banner"
                className="absolute bottom-2 right-2 border-2 rounded-[50%] size-11 cursor-pointer p-0 bg-secondary-foreground text-primary-foreground flex items-center justify-center">
                <BsImage size={16} />
              </Label>

              <div
                onClick={getRandomBanner}
                className="absolute top-2 left-2 border-2 rounded-[50%] size-11 cursor-pointer p-0 bg-secondary-foreground text-primary-foreground flex items-center justify-center">
                <LiaRandomSolid size={18} />
              </div>
            </>
          )}
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex-1 h-max flex flex-col gap-4">
          <div className="flex items-center justify-end">
            <div className="py-1.5 px-3 pl-2.5 rounded-md bg-secondary text-[13px] text-center font-semibold cursor-pointer flex items-center">
              {isEventFree ? (
                <>
                  <Globe size={15} className="mr-2" />
                  Public
                </>
              ) : (
                <>
                  <Globe size={15} className="mr-2" />
                  Private
                </>
              )}
            </div>
          </div>
          {/* //? EVENT TITLE STARTS HERE */}
          <FormField
            control={form.control}
            disabled={isCreating !== CreatingEvent.STOP || !credentials}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TextareaAutosize
                    {...field}
                    minRows={1}
                    maxRows={6}
                    autoFocus
                    className="w-full border border-x-0 shadow-none outline-none text-3xl md:text-4xl font-extrabold placeholder:font-extrabold placeholder:opacity-60 px-2 py-4 md:px-0 bg-secondary/30 md:bg-transparent border-y resize-none first-letter:uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                    autoComplete="off"
                    placeholder="Event Name"
                    disabled={isCreating !== CreatingEvent.STOP || !credentials}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* //? EVENT TITLE ENDS HERE */}

          <div
            className={cn(
              "bg-secondary/50 rounded-lg flex-1 flex flex-col border h-max",
              {
                "opacity-50": isCreating !== CreatingEvent.STOP,
              }
            )}>
            {/* //? EVENT REGISTRATION STARTS HERE */}
            <Popover>
              <PopoverTrigger
                disabled={isCreating !== CreatingEvent.STOP || !credentials}
                asChild>
                <div
                  className={cn(
                    "flex items-center pl-3 w-full cursor-pointer",
                    {
                      "cursor-not-allowed": isCreating !== CreatingEvent.STOP,
                    }
                  )}>
                  <FaCircle size={18} className="mr-2 text-foreground" />
                  <p className="border-b py-3 pr-3 w-full text-sm flex items-center justify-between">
                    <span className="text-foreground">Reg. Date</span>
                    <span className="flex items-center text-muted-foreground">
                      {registration?.from ? (
                        registration.to ? (
                          <>
                            {format(registration.from, "LLL dd, y")} -{" "}
                            {format(registration.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(registration.from, "LLL dd, y")
                        )
                      ) : (
                        "Reg start and end date"
                      )}
                      <IoCalendarNumberOutline
                        size={17}
                        className="ml-2 text-muted-foreground"
                      />
                    </span>
                  </p>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={registration?.from}
                  selected={registration}
                  onSelect={setRegistration}
                  disabled={(date) =>
                    date < new Date() ||
                    date < new Date("1900-01-01") ||
                    !credentials
                  }
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>
            {/* //? EVENT REGISTRATION ENDS HERE */}

            {/* //? EVENT DATE STARTS HERE */}
            <Popover>
              <PopoverTrigger
                disabled={isCreating !== CreatingEvent.STOP || !credentials}
                asChild>
                <div
                  className={cn(
                    "flex items-center pl-3 w-full cursor-pointer",
                    {
                      "cursor-not-allowed": isCreating !== CreatingEvent.STOP,
                    }
                  )}>
                  <FaRegCircle size={18} className="mr-2 text-foreground" />
                  <p className="py-3 pr-3 w-full text-sm flex items-center justify-between">
                    <span className="text-foreground">Event Date</span>
                    <span className="flex items-center text-muted-foreground">
                      {eventDate?.from ? (
                        eventDate.to ? (
                          <>
                            {format(eventDate.from, "LLL dd, y")} -{" "}
                            {format(eventDate.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(eventDate.from, "LLL dd, y")
                        )
                      ) : (
                        "Event start and end date"
                      )}
                      <IoCalendarNumberOutline
                        size={17}
                        className="ml-2 text-muted-foreground"
                      />
                    </span>
                  </p>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={eventDate?.from}
                  selected={eventDate}
                  onSelect={setEventDate}
                  disabled={(date) =>
                    date < new Date() ||
                    date < new Date("1900-01-01") ||
                    !credentials
                  }
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>
            {/* //? EVENT DATE ENDS HERE */}
          </div>

          {/* //? EVENT DESCRIPTION STARTS HERE */}
          <AlertDialog>
            <AlertDialogTrigger
              disabled={isCreating !== CreatingEvent.STOP || !credentials}>
              <div
                className={cn("bg-secondary/50 rounded-lg p-3 flex border", {
                  "cursor-not-allowed opacity-50":
                    isCreating !== CreatingEvent.STOP,
                })}>
                <TfiWrite size={17} className="mr-2 text-foreground" />
                <p className="text-sm flex flex-col text-start flex-1 text-foreground">
                  {description ? (
                    <>
                      <span className="text-foreground">Event Description</span>
                      <span className="text-xs text-muted-foreground flex-1 line-clamp-1">
                        {description}
                      </span>
                    </>
                  ) : (
                    <span className="text-foreground">Add Description</span>
                  )}
                </p>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-[480px] w-full border rounded-xl backdrop-blur-3xl bg-secondary flex flex-col p-0 space-y-0 gap-0">
              <div className="flex flex-col space-y-0">
                <div className="px-4 py-3 text-md">Event Description</div>
                <div className="py-2 px-4 bg-background">
                  <TextareaAutosize
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    minRows={10}
                    maxRows={16}
                    placeholder="Who should come? What's the event about?"
                    className="w-full bg-transparent text-sm placeholder:text-muted-foreground/50 resize-none outline-none border-none"
                    disabled={isCreating !== CreatingEvent.STOP || !credentials}
                  />
                  <FormMessage />
                </div>
              </div>

              <div className="pb-3 px-4 flex items-center justify-between bg-background rounded-b-[inherit]">
                <p
                  className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  onClick={() => setOpenSuggestionBox(true)}>
                  {isGenerating ? (
                    <>
                      <Loader size={16} className="mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Loader size={16} className="mr-2" />
                      Suggest with AI
                    </>
                  )}
                </p>

                <div className="flex items-center gap-2">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Done</AlertDialogAction>
                </div>
              </div>
            </AlertDialogContent>
          </AlertDialog>

          {isCreating === CreatingEvent.STOP && credentials && (
            <AlertDialog open={openSuggestionBox}>
              <AlertDialogContent className="max-w-[360px] w-full border rounded-[20px] backdrop-blur-3xl bg-secondary/60 flex flex-col gap-4">
                <div className="w-full">
                  <div className="rounded-full size-16 bg-secondary/80 flex items-center justify-center border">
                    <ScrollText size={36} className="text-muted-foreground" />
                  </div>
                </div>

                <h1 className="text-lg md:text-[22px] font-bold">
                  Suggest Description
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground -mt-2">
                  Generate description for your event with AI.
                </p>

                <div className="w-full flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <FormLabel>Additional Instructions</FormLabel>

                    <TextareaAutosize
                      name="prompt"
                      onChange={(e) => setPrompt(e.target.value)}
                      minRows={5}
                      maxRows={5}
                      placeholder="Enter prompt to generate description"
                      className="w-full bg-background/50 text-sm placeholder:text-muted-foreground/50 resize-none outline-none shadow p-2 rounded-md border"
                      disabled={
                        isCreating !== CreatingEvent.STOP || !credentials
                      }
                    />
                  </div>

                  <div className="flex gap-3">
                    <AlertDialogAction
                      className="w-full"
                      disabled={isGenerating || !credentials}
                      onClick={handleGenerateDescription}>
                      {isGenerating ? (
                        <>
                          <Loader size={16} className="mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Loader size={16} className="mr-2" />
                          Generate
                        </>
                      )}
                    </AlertDialogAction>
                    <AlertDialogCancel
                      disabled={isGenerating || !credentials}
                      onClick={() => setOpenSuggestionBox(false)}
                      className="w-full">
                      Cancel
                    </AlertDialogCancel>
                  </div>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {/* //? EVENT DESCRIPTION ENDS HERE */}

          <div
            className={cn(
              "bg-secondary/50 rounded-lg w-full flex flex-col border",
              {
                "opacity-50": isCreating !== CreatingEvent.STOP,
              }
            )}>
            {/* //? EVENT TICKETING STARTS HERE */}
            <FormField
              control={form.control}
              disabled={isCreating !== CreatingEvent.STOP || !credentials}
              name="ticketCost"
              render={({ field }) => (
                <AlertDialog>
                  <AlertDialogTrigger
                    disabled={
                      isCreating !== CreatingEvent.STOP || !credentials
                    }>
                    <div
                      className={cn("flex items-center pl-3 w-full", {
                        "cursor-not-allowed": isCreating !== CreatingEvent.STOP,
                      })}>
                      <LuTicket size={18} className="mr-2 text-foreground" />
                      <p className="border-b py-3 pr-3 w-full text-sm flex items-center justify-between">
                        <span className="text-foreground">Ticket</span>
                        <span className="flex items-center text-muted-foreground">
                          {!isEventFree ? `${field.value} BLM` : "Free Ticket"}
                          <ImCoinDollar
                            size={18}
                            className="ml-2 text-muted-foreground"
                          />
                        </span>
                      </p>
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-[360px] w-full border rounded-[20px] backdrop-blur-3xl bg-secondary/60 flex flex-col gap-4">
                    <div className="w-full">
                      <div className="rounded-full size-16 bg-secondary/80 flex items-center justify-center border">
                        <LuTicket size={36} className="text-muted-foreground" />
                      </div>
                    </div>

                    <h1 className="text-lg md:text-[22px] font-bold">
                      Ticket cost (BLUM)
                    </h1>
                    <p className="text-xs md:text-sm text-muted-foreground -mt-2">
                      You have the option to make your tickets free or for sale.
                    </p>

                    <div className="w-full flex flex-col gap-2">
                      <Select
                        disabled={
                          isCreating !== CreatingEvent.STOP || !credentials
                        }
                        onValueChange={(value) => {
                          setIsEventFree(value === "free" ? true : false);
                          if (value === "free") {
                            field.onChange(1);
                          }
                        }}
                        defaultValue={isEventFree ? "free" : "paid"}
                        value={isEventFree ? "free" : "paid"}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                        </SelectContent>
                      </Select>

                      {!isEventFree && (
                        <FormItem>
                          <FormLabel>Ticket Cost</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="0.5 BLM"
                              className="h-10"
                              type="number"
                              onBlur={(e) => {
                                const value = e.target.value;
                                if (value === "") {
                                  field.onChange(0.001);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}

                      <div className="flex gap-3">
                        <AlertDialogAction className="w-full">
                          Continue
                        </AlertDialogAction>
                        <AlertDialogCancel className="w-full">
                          Cancel
                        </AlertDialogCancel>
                      </div>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            />
            {/* //? EVENT TICKETING ENDS HERE */}

            {/* //? EVENT LOCATION STARTS HERE */}
            <FormField
              control={form.control}
              disabled={isCreating !== CreatingEvent.STOP || !credentials}
              name="location"
              render={({ field }) => (
                <AlertDialog>
                  <AlertDialogTrigger
                    disabled={
                      isCreating !== CreatingEvent.STOP || !credentials
                    }>
                    <div
                      className={cn("flex items-center pl-3 w-full", {
                        "cursor-not-allowed": isCreating !== CreatingEvent.STOP,
                      })}>
                      <MdOutlineShareLocation
                        size={20}
                        className="mr-2 text-foreground"
                      />
                      <p className="border-b py-3 pr-3 w-full text-sm flex items-center justify-between">
                        <span className="text-foreground">Event Location</span>
                        <span className="flex items-center text-muted-foreground gap-2">
                          {field.value &&
                          field.value.includes("meet.google.com") ? (
                            <>
                              Google Meet
                              <SiGooglemeet
                                size={16}
                                className="text-sm text-muted-foreground min-w-[18px]"
                              />
                            </>
                          ) : field.value &&
                            field.value.includes("youtube.com") ? (
                            <>
                              YouTube
                              <TbBrandYoutubeFilled
                                size={16}
                                className="text-sm text-muted-foreground min-w-[18px]"
                              />
                            </>
                          ) : field.value && field.value.includes("bit.ly") ? (
                            <>
                              Bitly
                              <SiBitly
                                size={16}
                                className="text-sm text-muted-foreground min-w-[18px]"
                              />
                            </>
                          ) : field.value &&
                            field.value.includes("https://" || "http://") ? (
                            <>
                              Online Location
                              <HiStatusOnline
                                size={16}
                                className="text-sm text-muted-foreground min-w-[18px]"
                              />
                            </>
                          ) : (
                            <>
                              Offline Location
                              <GrMapLocation
                                size={16}
                                className="text-sm text-muted-foreground min-w-[18px]"
                              />
                            </>
                          )}
                        </span>
                      </p>
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-[360px] w-full border rounded-[20px] backdrop-blur-3xl bg-secondary/60 flex flex-col gap-4">
                    <div className="w-full">
                      <div className="rounded-full size-16 bg-secondary/80 flex items-center justify-center border">
                        <HiOutlineLocationMarker
                          size={36}
                          className="text-muted-foreground"
                        />
                      </div>
                    </div>

                    <h1 className="text-lg md:text-[22px] font-bold">
                      Location for Event
                    </h1>
                    <p className="text-xs md:text-sm text-muted-foreground -mt-2">
                      For offline events, specify venue; for online events,
                      include a link (Google Meet, YouTube, etc.).
                    </p>

                    <div className="w-full flex flex-col gap-2">
                      <Select
                        disabled={
                          isCreating !== CreatingEvent.STOP || !credentials
                        }
                        onValueChange={(value) => {
                          setIsEventOnline(value === "online" ? true : false);
                        }}
                        defaultValue={isEventOnline ? "online" : "offline"}
                        value={isEventOnline ? "online" : "offline"}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="online">Online</SelectItem>
                          <SelectItem value="offline">Offline</SelectItem>
                        </SelectContent>
                      </Select>

                      {isEventOnline ? (
                        <FormItem>
                          <FormLabel>Link</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="https://www.youtube.com/xyz"
                              className="h-10"
                              type="url"
                              disabled={
                                isCreating !== CreatingEvent.STOP ||
                                !credentials
                              }
                              onBlur={(e) => {
                                const value = e.target.value;
                                if (value === "") {
                                  field.onChange("https://bit.ly/4bQYpoO");
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      ) : (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Lagos State, Nigeria"
                              className="h-10"
                              disabled={
                                isCreating !== CreatingEvent.STOP ||
                                !credentials
                              }
                              type="text"
                              onBlur={(e) => {
                                const value = e.target.value;
                                if (value === "") {
                                  field.onChange("Random Location");
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}

                      <div className="flex gap-3">
                        <AlertDialogAction className="w-full">
                          Continue
                        </AlertDialogAction>
                        <AlertDialogCancel className="w-full">
                          Cancel
                        </AlertDialogCancel>
                      </div>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            />
            {/* //? EVENT LOCATION ENDS HERE */}

            {/* //? EVENT CAPACITY STARTS HERE */}
            <FormField
              control={form.control}
              disabled={isCreating !== CreatingEvent.STOP || !credentials}
              name="capacity"
              render={({ field }) => (
                <AlertDialog>
                  <AlertDialogTrigger
                    disabled={
                      isCreating !== CreatingEvent.STOP || !credentials
                    }>
                    <div
                      className={cn("flex items-center pl-3 w-full", {
                        "cursor-not-allowed": isCreating !== CreatingEvent.STOP,
                      })}>
                      <MdOutlineReduceCapacity
                        size={18}
                        className="mr-2 text-foreground"
                      />
                      <p className="py-3 pr-3 w-full text-sm flex items-center justify-between">
                        <span className="text-foreground">Capacity</span>
                        <span className="flex items-center text-muted-foreground">
                          {!isEventUnlimited
                            ? `${field.value} Seat(s)`
                            : "Unlimited"}
                          <Sofa
                            size={18}
                            className="ml-2 text-muted-foreground"
                          />
                        </span>
                      </p>
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-[360px] w-full border rounded-[20px] backdrop-blur-3xl bg-secondary/60 flex flex-col gap-4">
                    <div className="w-full">
                      <div className="rounded-full size-16 bg-secondary/80 flex items-center justify-center border">
                        <MdOutlineReduceCapacity
                          size={36}
                          className="text-muted-foreground"
                        />
                      </div>
                    </div>

                    <h1 className="text-lg md:text-[22px] font-bold">
                      Event Capacity
                    </h1>
                    <p className="text-xs md:text-sm text-muted-foreground -mt-2">
                      You have the option of selecting a fixed number of seats
                      or an unlimited capacity.
                    </p>

                    <div className="w-full flex flex-col gap-2">
                      <Select
                        onValueChange={(value) => {
                          setIsEventUnlimited(
                            value === "unlimited" ? true : false
                          );
                          if (value === "unlimited") {
                            field.onChange(10);
                          }
                        }}
                        defaultValue={
                          isEventUnlimited ? "unlimited" : "limited"
                        }
                        value={isEventUnlimited ? "unlimited" : "limited"}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="unlimited">Unlimited</SelectItem>
                          <SelectItem value="limited">Limited</SelectItem>
                        </SelectContent>
                      </Select>

                      {!isEventUnlimited && (
                        <FormItem>
                          <FormLabel>Number of seats</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="10 Seat(s)"
                              className="h-10"
                              type="number"
                              onBlur={(e) => {
                                const value = e.target.value;
                                if (value === "") {
                                  field.onChange(10);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}

                      <div className="flex gap-3">
                        <AlertDialogAction className="w-full">
                          Continue
                        </AlertDialogAction>
                        <AlertDialogCancel className="w-full">
                          Cancel
                        </AlertDialogCancel>
                      </div>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            />
            {/* //? EVENT CAPACITY ENDS HERE */}
          </div>

          {credentials && (
            <Button
              type="submit"
              size="lg"
              className="mt-4"
              disabled={isCreating !== CreatingEvent.STOP || !credentials}>
              {isCreating !== CreatingEvent.STOP ? (
                <>
                  <Loader className="animate-spin mr-2" size={16} />
                  {isCreating === CreatingEvent.APPROVING
                    ? "Approving Transaction..."
                    : isCreating === CreatingEvent.UPLOADING
                    ? "Uploading Banner..."
                    : isCreating === CreatingEvent.START && "Creating Event..."}
                </>
              ) : (
                "Create Event"
              )}
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
}
