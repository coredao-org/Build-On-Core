import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import { EnStatus } from "@/enums";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export const generateDescription = async (prompt: string) => {
  const chatSession = model.startChat({
    generationConfig,
  });

  const result = await chatSession.sendMessageStream(
    `You are create an event description (not more than 300 words) based on the title or brief description provided below. When starting, leave off the title and attempt to conclude it like this. Join us [continuation]; you can use emojis and provide paragraphs if required.\nTitle: ${prompt}`
  );
  return (await result.response).text();
};

export const uploadBannerToPinata = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const options = {
      method: "POST",
      data: formData,
      url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
      headers: {
        pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
        pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_API_SECRET,
        "Content-Type": "multipart/form-data",
      },
    };

    const response = await axios(options);
    const fileUrl = response?.data?.IpfsHash;

    if (!fileUrl) {
      throw new Error("Failed to upload file(s) to Pinata");
    }

    return fileUrl;
  } catch (error) {
    console.error("Error uploading file(s) to Pinata:", error);
    throw new Error("Failed to upload file(s) to Pinata");
  }
};

export const base64ToBlob = (base64: any, contentType: any) => {
  const byteCharacters = atob(base64.split(",")[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

// Function to convert Blob to File
export const blobToFile = (blob: any, fileName: any) => {
  const file = new File([blob], fileName, { type: blob.type });
  return file;
};

export const shortenAddress = (addr: string) => {
  return `${addr?.substring(0, 4)}...${addr?.substring(addr.length - 4)}`;
};

export const formatTime = (): string => {
  const now = new Date();

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZoneName: "short",
  });

  // Format the current time
  const formattedTime = timeFormatter.format(now);

  return formattedTime;
};

export const formatReadableDate = (dateString: any) => {
  const date = new Date(dateString);

  // Days and months arrays
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Extracting components of the date
  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  // Constructing the readable date format
  return `${dayName}, ${month} ${day}, ${year}`;
};

// export const getInitials = (name: string): string => {
//   const namesArray = name?.trim()?.split(" ");
//   if (namesArray.length === 0) return "";

//   const initials = namesArray.map((namePart) =>
//     namePart.charAt(0).toUpperCase()
//   );
//   return initials.join("");
// };

export const getExpiryDate = (timestamp: number) => {
  const currentDate = Date.now();
  const diffInMilliseconds = timestamp - currentDate;
  const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));

  return diffInDays;
};

export const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    timeZoneName: "short",
  };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  return formattedDate;
};

export const calculateDateDifference = ({
  startTimestamp,
  endTimestamp,
  endedMessage,
  notStartedMessage,
}: {
  startTimestamp: number;
  endTimestamp: number;
  endedMessage: string;
  notStartedMessage: string;
}) => {
  const currentDate = new Date();
  const startDate: any = new Date(startTimestamp);
  const endDate: any = new Date(endTimestamp);

  if (currentDate > startDate) {
    return endedMessage;
  }
  if (currentDate < startDate) {
    return notStartedMessage;
  }

  const diffInMs = Math.abs(endDate - startDate);
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays > 0) {
    return `${diffInDays} day(s)`;
  }

  const diffInHours = Math.floor((diffInMs / (1000 * 60 * 60)) % 24);
  const diffInMinutes = Math.floor((diffInMs / (1000 * 60)) % 60);

  return `${diffInHours} ${
    diffInHours < 2 ? "hour" : "hours"
  }, ${diffInMinutes} ${diffInMinutes < 2 ? "minute" : "minutes"}`;
};

export const timestampToDatetimeLocal = (timestamp: number): string => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed in JavaScript
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const getStatus = (now: any, start: number, end: number) => {
  if (now < start) {
    return EnStatus.PENDING;
  } else if (now >= start && now <= end) {
    return EnStatus.OPEN;
  } else {
    return EnStatus.CLOSE;
  }
};

export const convertScientificNotation = (num: number) => {
  if (typeof num !== "number") {
    throw new TypeError("Input must be a number");
  }

  return num.toLocaleString("fullwide", { useGrouping: false });
};
