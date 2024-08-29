"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { sendMessageSchema } from "@/lib/validators";
import TextareaAutosize from "react-textarea-autosize";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { sendMessage } from "@/services/bluma-contract";
import { toast } from "sonner";
import {
  ArrowUpFromDot,
  CornerDownLeft,
  ImageIcon,
  Loader,
  MicIcon,
  Plus,
  VideoIcon,
} from "lucide-react"; // Import the CooldownTimer component
import { PiWarningOctagonLight } from "react-icons/pi";
import { RocketIcon } from "@radix-ui/react-icons";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SendMessage({
  eventId,
  getMessages,
}: {
  eventId: number;
  getMessages: any;
}) {
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isCoolDown, setIsCoolDown] = useState(false);

  const form = useForm<z.infer<typeof sendMessageSchema>>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {},
  });

  const handleCoolDownComplete = () => {
    setIsCoolDown(false);
  };

  async function onSubmit(values: z.infer<typeof sendMessageSchema>) {
    if (isCoolDown) {
      toast.error(
        "Please wait for the cool down period to end before sending another message.",
      );
      return;
    }

    setIsSendingMessage(true);
    try {
      const data = await sendMessage(Number(eventId), values?.message);
      if (data?.success) {
        toast.success("Message sent successfully! 🎉");
        form.reset({ message: "" });
        // setIsCoolDown(false);
        getMessages();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error: any) {
      console.log("error", error);
    } finally {
      setIsSendingMessage(false);
    }
  }

  return (
    <div className="sticky bottom-0 rounded-full bg-background px-4 py-2 z-10">
      {isCoolDown ? (
        <CoolDownTimer
          initialSeconds={2}
          onCoolDownComplete={handleCoolDownComplete}
        />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-end w-full h-max"
          >
            <Button
              disabled
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full size-10 sm:size-11 hidden sm:flex"
            >
              <ImageIcon size={18} />
            </Button>
            <Button
              disabled
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full size-10 sm:size-11 hidden md:flex"
            >
              <VideoIcon size={18} />
            </Button>
            <Button
              disabled
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full size-10 sm:size-11 hidden lg:flex"
            >
              <MicIcon size={18} />
            </Button>

            <FormField
              disabled={isSendingMessage}
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="ml-0 sm:ml-2 mr-2 flex-1 rounded-3xl bg-secondary/50 relative">
                  <FormMessage className="absolute -top-6 left-5" />
                  <FormControl>
                    <TextareaAutosize
                      {...field}
                      minRows={1}
                      maxRows={6}
                      autoFocus
                      autoComplete="off"
                      placeholder="What would you like to say?"
                      disabled={isSendingMessage}
                      className="w-full h-10 sm:h-11 px-4 pt-2.5 pb-1 sm:pt-3 sm:pb-1.5 sm:px-5 bg-transparent outline-none border-none text-sm disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              variant="secondary"
              size="icon"
              className="rounded-full size-10 sm:size-11"
              disabled={isSendingMessage}
            >
              {isSendingMessage ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                <CornerDownLeft size={17} />
              )}
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}

// Cool down Timer Component
const CoolDownTimer = ({
  initialSeconds,
  onCoolDownComplete,
}: {
  initialSeconds: any;
  onCoolDownComplete: any;
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => {
        setSeconds((prevSeconds: any) => prevSeconds - 1);
      }, 1000);

      return () => clearInterval(timer); // Cleanup the interval on component unmount
    } else {
      onCoolDownComplete();
    }
  }, [seconds, onCoolDownComplete]);

  const formatTime = (seconds: any) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  };

  return (
    <Alert>
      <RocketIcon className="size-4" />
      <AlertTitle className="flex items-center justify-between">
        <span>Time Out!</span>
        <span>{formatTime(seconds)}</span>
      </AlertTitle>
      <AlertDescription className="text-xs sm:text-[13px]">
        Please wait 60 seconds between messages to prevent spam.
      </AlertDescription>
    </Alert>
  );
};
