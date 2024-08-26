interface ILayout {
  children: React.ReactNode;
}

interface IAvatar {
  src?: string;
  initials?: string;
  size: "sm" | "default";
}

interface ICredential {
  address: string;
  email: string;
  avatar: string;
  isRegistered?: boolean;
  balance?: number;
  createdAt?: any;
}

interface ITicket {
  ticketId: number;
  eventId: number;
  buyer: string;
  ticketCost: number;
  purchaseTime: number;
  numberOfTicket: number;
}

interface IRoomMessages {
  sender: string;
  email: string;
  text: string;
  timestamp: number;
}

interface IRoomMember {
  user: ICredential;
  joinTime: number;
}

interface IEventRoom {
  eventId: number;
  title: string;
  imageUrl: string;
  description: string;
  members: IRoomMember[];
  messages: IRoomMessages[];
}

interface IWrapper {
  children: React.ReactNode;
  className?: string;
}

interface IEvent {
  eventId: number;
  title: any;
  imageUrl: string;
  location: string;
  description: string;
  owner: ICredential;
  seats: number;
  capacity: number;
  regStartsTime: number;
  regEndsTime: number;
  room: IEventRoom;
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
}

type ICreateEvent = Pick<
  IEvent,
  | "title"
  | "ticketPrice"
  | "capacity"
  | "location"
  | "imageUrl"
  | "description"
  | "regEndsTime"
  | "regStartsTime"
  | "eventEndsTime"
  | "eventStartsTime"
>;

interface IGlobalContextProvider {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  fetchUser: () => void;
  isFetchingUser: boolean;
  credentials: ICredential | undefined;
  setCredentials: React.Dispatch<React.SetStateAction<ICredential | undefined>>;
  signOut: () => Promise<void>;
}

interface IPayment {
  id: string;
  tokens: number;
  status: "pending" | "processing" | "success" | "failed";
  address: string;
}
