import { z } from "zod";

export const authSchema = z.object({
  email: z.string().min(3),
});

export const otpSchema = z.object({
  pin: z.string().min(6, {
    message: "One-time password must be 6 characters.",
  }),
});

export const mintSchema = z.object({
  tokens: z.string().min(2).max(50),
  address: z.string().min(2).max(50),
});

export const createEventSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: "Event Title too short, minimum is 3 characters",
    })
    .max(100, {
      message: "Event Title too long, maximum is 100 characters",
    }),
  location: z.string(),
  capacity: z.coerce
    .number()
    .min(2, {
      message: "Capacity can not be less than 2",
    })
    .max(50000, {
      message: "Capacity can not be more than 50000",
    })
    .optional(),
  ticketCost: z.coerce
    .number()
    .min(1, {
      message: "Ticket cost must not be less than 1 BLUM",
    })
    .max(100, {
      message: "Ticket cost must not be more than 100 BLUM",
    })
    .optional(),
});

export const sendMessageSchema = z.object({
  message: z
    .string({
      required_error:
        "Please provide some text; the message field is not empty.",
    })
    .min(3, {
      message: "A message must have a minimum of 3 characters.",
    })
    .max(700, {
      message: "A message should contain no more than 700 characters.",
    }),
});
