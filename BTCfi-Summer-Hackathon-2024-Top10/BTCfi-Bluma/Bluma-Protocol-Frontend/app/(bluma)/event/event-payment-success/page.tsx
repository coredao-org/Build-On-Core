"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import { purchaseFreeTicket } from "@/services/bluma-contract";
import {
  emitEventNotification,
  purchaseTicketSuccessEmail,
} from "@/services/renderNotification";
import { toast } from "sonner";

const PaymentSuccessPage = ({ searchParams }: { searchParams: any }) => {
  const eventId = searchParams.eventId;
  const numTicket = searchParams.numTicket;
  const purchaserEmail = searchParams.purchaserEmail;
  const creatorEmail = searchParams.creatorEmail;
  const title = searchParams.title;
  const location = searchParams.location;

  async function sendPurchaseEmails() {
    if (
      eventId &&
      numTicket &&
      purchaserEmail &&
      creatorEmail &&
      title &&
      location
    ) {
      const emailResult = await purchaseTicketSuccessEmail(
        purchaserEmail,
        creatorEmail,
        title,
        Number(numTicket),
        location,
      );
      if (!emailResult) {
        console.warn("Failed to send purchase confirmation email");
      }
    }
  }

  function notifyUser() {
    emitEventNotification({
      title: "Ticket purchased",
      description: `Transaction confirmed! You now have ${numTicket} tickets`,
    });
  }

  useEffect(() => {
    const handleSuccessfulPayment = async () => {
      if (eventId && numTicket) {
        try {
          const purchaseResult = await purchaseFreeTicket(
            Number(eventId),
            Number(numTicket),
          );
          if (purchaseResult) {
            await sendPurchaseEmails();
            notifyUser();
            toast.success("You now have a space in this event.");
          }
        } catch (error) {
          console.error("Failed to complete post-payment actions:", error);
        }
      }
    };

    handleSuccessfulPayment();
  }, [eventId, numTicket]);

  return <div>Payment Successful! Processing your order...</div>;
};

export default PaymentSuccessPage;
