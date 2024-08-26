import { Ticket, PencilLine, ShoppingCart } from "lucide-react";

export const nav_links = [
  {
    name: "Events",
    icon: Ticket,
    path: "/home",
  },
  {
    name: "What's New",
    icon: PencilLine,
    path: "/update",
  },
  {
    name: "Get Token",
    icon: ShoppingCart,
    path: "/market",
  },
];

export const site = {
  name: "Bluma",
  description: "Delightful events start here.",
  url: "https://bluma-protocol-frontend.vercel.app/",
  icon: "/assets/logo.png",
  author: "Abdullahi Salihu",
  profile: "https://ttatyz.vercel.app/",
};

export const CreatingEvent = {
  START: true,
  STOP: false,
  UPLOADING: "uploading",
  APPROVING: "approving",
};

export const MintingNFT = {
  START: true,
  STOP: false,
  UPLOADING: "uploading",
};

export const Authenticating = {
  START: true,
  STOP: false,
  GENERATING: "generating",
};

export const bannerCIDs = [
  "QmPukaS5FJ5YVEAEC9c8mJnGAtrgeyFjrpRcJE6zr74gPC",
  "QmRUS6LvXpK4pT2QS8SkssAjUy9r4hYjdNVKa9LPiKAM9g",
  "Qmd7Lx9wGRYhbQCVhWHVpxpiaiVRvFwxqA9Duk7mh5xRmQ",
  "QmYtCfux8Wri3oUNyzx7kQ6GJ4e4Ac6d9HsgbV9JdbR6xg",
  "QmNd4N2EZw5zHhL1rCiAAyFoqNvwL51x4F85SHyKu63Ms9",
  "QmX68bpuiS63MgMXSnAS7V3k5xhiYA3L9n7qDmfZ6dqXa4",
  "Qmcqo1eiTAcXwv3ZYTrEsjz8VkRVTPmqkCPFZNcowF3QQJ",
  "QmPukaS5FJ5YVEAEC9c8mJnGAtrgeyFjrpRcJE6zr74gPC",
];

interface IEvent {
  eventId: number;
  title: any;
  imageUrl: string;
  location: string;
  description: string;
  owner: any;
  seats: number;
  capacity: number;
  regStartsTime: number;
  regEndsTime: number;
  regStatus: string | number;
  eventStatus: string | number;
  eventType: string | number;
  nftUrl: string;
  eventStartsTime: number;
  eventEndsTime: number;
  ticketPrice: number;
  totalSales: number;
  createdAt: number;
  isEventPaid: boolean;
  room: any;
}

export const dummyEvents: IEvent[] = [
  {
    eventId: 3,
    title: "Unadulterated Randomness!  🎉",
    imageUrl: "QmVgzAKuLzQimJJ5Hhy3Gd7KRME2dRm93xuMuoQM4bU4CL",
    location: "Lagos, Nigeria",
    description:
      "Get ready for an unforgettable experience filled with surprises, laughter, and maybe even a little bit of chaos! This event is all about embracing the unexpected and letting loose. We've got a wild mix of activities planned, from interactive games and creative challenges to spontaneous performances and delicious treats. \n\nCome with an open mind and a willingness to try new things.  You never know what adventures await you!  There's no dress code, just bring your energy and your sense of fun. \n\nJoin us for an evening of pure, unadulterated randomness! 🎉",
    owner: {
      email: "sitebldrs@gmail.com",
      address: "0xB6B0746f8137Db1E788597CFcD818e2B3bfF6324",
      isRegistered: true,
      avatar: "QmUUbPVYrizedLkMDEjjFUQdP3VbRXR2i7jriZMiZEBHji",
      balance: 0,
    },
    seats: 2,
    capacity: 50000,
    regStartsTime: 1719428099860,
    regEndsTime: 1719442800000,
    room: {
      eventId: 3,
      title: "Unadulterated Randomness!  🎉",
      imageUrl: "QmVgzAKuLzQimJJ5Hhy3Gd7KRME2dRm93xuMuoQM4bU4CL",
      description:
        "Get ready for an unforgettable experience filled with surprises, laughter, and maybe even a little bit of chaos! This event is all about embracing the unexpected and letting loose. We've got a wild mix of activities planned, from interactive games and creative challenges to spontaneous performances and delicious treats. \n\nCome with an open mind and a willingness to try new things.  You never know what adventures await you!  There's no dress code, just bring your energy and your sense of fun. \n\nJoin us for an evening of pure, unadulterated randomness!  🎉",
      members: [
        {
          email: "sitebldrs@gmail.com",
          address: "0xB6B0746f8137Db1E788597CFcD818e2B3bfF6324",
          isRegistered: true,
          avatar: "QmUUbPVYrizedLkMDEjjFUQdP3VbRXR2i7jriZMiZEBHji",
          balance: 0,
          joinTime: 1719434569000,
        },
        {
          email: "abdullahisalihuinusa@gmail.com",
          address: "0xE4d1803F761eC789787Ecde56E6b8E4dab11758E",
          isRegistered: true,
          avatar: "QmVBJQFPBvCHXo82zJdWHbNNjkcqKTsaK8SKehgFJKCQNV",
          balance: 0,
          joinTime: 1719434763000,
        },
      ],
      messages: [],
    },
    regStatus: "CLOSE",
    eventStatus: "CLOSE",
    eventType: "FREE",
    nftUrl: "",
    // June 26 2024
    eventStartsTime: 1719428099860,
    // June 27 2024
    eventEndsTime: 1719442800000,
    ticketPrice: 0,
    totalSales: 0,
    createdAt: 1719428242000,
    isEventPaid: false,
  },
];
