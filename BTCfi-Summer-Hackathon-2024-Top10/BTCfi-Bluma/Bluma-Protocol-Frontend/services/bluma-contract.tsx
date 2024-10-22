import { EnEvent, EnStatus } from "@/enums";
import { getStatus } from "@/lib/utils";
import {
  getBlumaContracts,
  getBlumaTokenContract,
  getBlumaNFTContract,
} from "./index";
import { ethers } from "ethers";

export const checkIfUserIsRegistered = async (address: string) => {
  try {
    if (!window.ethereum) {
      throw new Error("Please install a browser provider");
    }

    const contract = await getBlumaContracts();
    const isRegistered: boolean = await contract.isRegistered(address);

    return isRegistered;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const getUser = async (
  address: string,
): Promise<ICredential | undefined> => {
  try {
    const contract = await getBlumaContracts();
    const user = await contract.getUser(address);

    const structuredUser: ICredential = {
      email: user[0],
      address: user[1],
      isRegistered: user[2],
      avatar: user[3],
      balance: Number(user[4]),
    };

    if (
      structuredUser?.address.toString() ===
      process.env.NEXT_PUBLIC_ADDRESS_ZERO?.toString()
    ) {
      return undefined;
    }

    return structuredUser;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const getAllUsers = async (): Promise<ICredential[] | undefined> => {
  try {
    const contract = await getBlumaContracts();
    const users = await contract.getAllUser();

    const redefinedUsers: ICredential[] = await users?.map((usr: any) => ({
      email: usr[0],
      address: usr[1],
      isRegistered: usr[2],
      avatar: usr[3],
      balance: Number(usr[4]),
    }));

    return redefinedUsers;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const createAccount = async (
  credentials: ICredential,
): Promise<ICredential> => {
  if (!window.ethereum) {
    reportError("Please install a browser provider");
    return Promise.reject(new Error("Browser provider not installed"));
  }

  try {
    const contract = await getBlumaContracts();
    const tx = await contract.createAccount(
      credentials.email,
      credentials.address,
      credentials.avatar,
    );
    await tx.wait();

    return Promise.resolve(tx);
  } catch (error) {
    reportError(error);
    return Promise.reject(error);
  }
};

export const createEvent = async (event: ICreateEvent) => {
  if (!window.ethereum) {
    reportError("Please install a browser provider");
    return Promise.reject(new Error("Browser provider not installed"));
  }

  const isEventPaid = event.ticketPrice !== 0;
  const newTicketPrice = event.ticketPrice || 10;

  try {
    const contract = await getBlumaContracts();

    const redefinedEventData = {
      _title: event.title,
      _imageUrl: event.imageUrl,
      _description: event.description,
      _location: event.location,
      _capacity: event.capacity,
      _regStartsTime: event.regStartsTime,
      _regEndsTime: event.regEndsTime,
      _eventStartsTime: event.eventStartsTime,
      _eventEndsTime: event.eventEndsTime,
      _ticketPrice: newTicketPrice,
      _isEventPaid: isEventPaid,
    };

    console.log(redefinedEventData);

    const tx = await contract.createEvent(
      redefinedEventData._title,
      redefinedEventData._imageUrl,
      redefinedEventData._description,
      redefinedEventData._location,
      redefinedEventData._capacity,
      redefinedEventData._regStartsTime,
      redefinedEventData._regEndsTime,
      redefinedEventData._eventStartsTime,
      redefinedEventData._eventEndsTime,
      redefinedEventData._ticketPrice,
      redefinedEventData._isEventPaid,
    );

    const result = await tx.wait();

    if (!result.status) {
      reportError("ERROR CREATING EVENT...");
      return Promise.reject("ERROR CREATING EVENT...");
    }

    return Promise.resolve(tx);
  } catch (error) {
    reportError(error);
    console.error("Transaction failed:", error); // Log error for debugging
    return Promise.reject(error);
  }
};

export const getAllEvents = async () => {
  try {
    if (!window.ethereum) {
      throw new Error("Please install a browser provider");
    }

    const contract = await getBlumaContracts();

    const events = await contract.getAllEvents();

    if (!events.length) return [];

    const refinedEvents = await Promise.all(
      events?.map(async (event: any) => {
        const eventOwner = await getUser(event[5]);

        const roomMembers = await Promise.all(
          event[10]?.[4]?.map(async (member: any) => {
            const user = await getUser(member?.user);

            return {
              ...user,
              joinTime: Number(member.joinTime),
            };
          }),
        );

        const roomMessages = await Promise.all(
          event[10]?.[5]?.map(async (message: any) => {
            const user = await getUser(message?.sender);

            return {
              sender: user?.address,
              avatar: user?.avatar,
              email: String(message.email),
              text: String(message.text),
              timestamp: Number(message.timestamp),
            };
          }),
        );

        return {
          eventId: Number(event[0]),
          title: String(event[1]),
          imageUrl: String(event[2]),
          location: String(event[3]),
          description: String(event[4]),
          owner: eventOwner,
          seats: Number(event[6]),
          capacity: Number(event[7]),
          regStartsTime: Number(event[8]),
          regEndsTime: Number(event[9]),
          room: {
            eventId: Number(event[10][0]),
            title: String(event[10][1]),
            imageUrl: event[10][2],
            description: String(event[10][3]),
            members: roomMembers,
            messages: roomMessages,
          },
          regStatus:
            EnStatus[getStatus(Date.now(), Number(event[8]), Number(event[9]))],
          eventStatus:
            EnStatus[
              getStatus(Date.now(), Number(event[15]), Number(event[16]))
            ],
          eventType: EnEvent[Number(event[13])],
          nftUrl: event[14],
          eventStartsTime: Number(event[15]),
          eventEndsTime: Number(event[16]),
          ticketPrice: Number(event[17]),
          totalSales: Number(event[18]),
          createdAt: Number(event[19]),
          isEventPaid: Boolean(event[20]),
        };
      }),
    );

    return refinedEvents;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const getEventById = async (
  eventId: number,
): Promise<IEvent | undefined> => {
  try {
    if (!window.ethereum) {
      throw new Error("Please install a browser provider");
    }

    const events = await getAllEvents();

    const singleEvent = events?.find(
      (evt: IEvent) => evt?.eventId === Number(eventId),
    );

    if (!singleEvent) {
      console.log("No event found");
      return undefined;
    }

    return singleEvent;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const getEventGroupById = async (eventId: number) => {
  if (!window.ethereum) {
    throw new Error("Please install a browser provider");
  }

  try {
    const event = await getEventById(eventId);

    if (!event) {
      console.log("No event found");
      return undefined;
    }

    return event.room;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const mintNFT = async (eventId: number, nftCID: string) => {
  if (!window.ethereum) {
    throw new Error("Please install a browser provider");
  }
  try {
    const contract = await getBlumaContracts();
    console.log({ eventId, nftCID });
    const tx = await contract.mintNft(eventId, nftCID);

    const result = await tx.wait();

    if (!result.status) throw new Error("Failed to mint nft");

    return result;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

// export const mintNFTsForAttendees = async (eventId: number) => {
//   if (!window.ethereum) {
//     throw new Error("Please install a browser provider");
//   }
//   try {
//     const contract = await getBlumaContracts();
//     // console.log({ eventId,  });
//     const tx = await contract.mintNFTsForAttendees(eventId);

//     const result = await tx.wait();

//     if (!result.status) throw new Error("Failed to mint nft");

//     return result;
//   } catch (error) {
//     reportError(error);
//     throw error;
//   }
// };

export const mintNFTsForAttendees = async (
  eventNFT: string,
  // creator: string,
  ticketBuyers: any[],
) => {
  if (!window.ethereum) {
    throw new Error("Please install a browser provider");
  }
  try {
    const contract = await getBlumaContracts();
    const nftContract = await getBlumaNFTContract();
    // const tx = await nftContract.safeMint(creator, eventNFT);
    for (let i = 0; i < ticketBuyers.length; i++) {
      const tx = await nftContract.safeMint(
        ticketBuyers[i]?.address.toString(),
        eventNFT,
      );

      const result = await tx.wait();

      if (!result.status) throw new Error("Failed to mint nft");

      return result;
    }
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const createSpace = async (eventId: number) => {
  if (!window.ethereum) {
    throw new Error("Please install a browser provider");
  }

  try {
    const contract = await getBlumaContracts();
    const tx = await contract.createGroup(eventId);

    const result = await tx.wait();

    if (!result.status) throw new Error("Failed to create space");

    return result;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const purchaseFreeTicket = async (
  eventId: any,
  numberOfTickets: number,
) => {
  if (!window.ethereum) {
    throw new Error("Please install a browser provider");
  }

  try {
    const contract = await getBlumaContracts();
    const tx = await contract.purchaseFreeTicket(eventId, numberOfTickets);

    const result = await tx.wait();

    console.log(result);

    if (!result.status) throw new Error("Failed to purchase ticket");

    return result;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const purchasePaidTicket = async (
  eventId: any,
  numberOfTickets: number,
  ticketPrice: number,
) => {
  if (!window.ethereum) {
    throw new Error("Please install a browser provider");
  }
  let totalSumPaid = ticketPrice * numberOfTickets;

  try {
    const contract = await getBlumaContracts();

    const tokenContract = await getBlumaTokenContract();
    const transfer = await tokenContract.transfer(
      process.env.NEXT_PUBLIC_BLUMA_CA,
      totalSumPaid,
    );
    await transfer.wait();

    const tx = await contract.purchaseFreeTicket(eventId, numberOfTickets);

    const result = await tx.wait();

    console.log(result);

    if (!result.status) throw new Error("Failed to purchase ticket");

    return result;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const refundFee = async (eventId: any) => {
  if (!window.ethereum) {
    throw new Error("Please install a browser provider");
  }

  try {
    const contract = await getBlumaContracts();
    const tx = await contract.refundFee(eventId);

    const result = await tx.wait();

    if (!result.status) throw new Error("Failed to refund fee");

    return result;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const getGroupMembersOfAnEvent = async (eventId: number) => {
  try {
    if (!window.ethereum) {
      throw new Error("Please install a browser provider");
    }

    const contract = await getBlumaContracts();
    const members = await contract.getGroupMembers(Number(eventId));

    const redefinedMembers = await members?.map((member: any) => ({
      address: String(member[0]),
      timestamp: Number(member[1]),
    }));

    if (!redefinedMembers) {
      console.log("No members found");
      return undefined;
    }

    return redefinedMembers;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const getUserTicket = async (address: string) => {
  if (!window.ethereum) {
    throw new Error("Please install a browser provider");
  }

  try {
    const contract = await getBlumaContracts();
    const ticket = await contract.getTicket(address);

    if (!ticket) {
      console.log("No tickets bought");
      return undefined;
    }

    const refinedTicket = {
      ticketId: Number(ticket[0]),
      eventId: Number(ticket[1]),
      buyer: String(ticket[2]),
      ticketCost: Number(ticket[3]),
      purchaseTime: Number(ticket[4]),
      numberOfTicket: Number(ticket[5]),
    };

    // Fetch user details for each ticket buyer
    const user: ICredential | undefined = await getUser(refinedTicket?.buyer);

    // Merge ticket details with user details
    const ticketWithUserDetails = {
      ...refinedTicket,
      ...user,
    };

    return ticketWithUserDetails;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const getAllTickets = async () => {
  if (!window.ethereum) {
    throw new Error("Please install a browser provider");
  }

  try {
    const contract = await getBlumaContracts();
    const tickets = await contract.getAllTickets();

    if (!tickets || tickets.length === 0) {
      console.log("No tickets bought");
      return [];
    }

    // Fetch user details for each ticket using getUserTicket function
    const promises = tickets?.map(async (ticket: any) => {
      try {
        const ticketDetails = {
          ticketId: Number(ticket[0]),
          eventId: Number(ticket[1]),
          buyer: String(ticket[2]),
          ticketCost: Number(ticket[3]),
          purchaseTime: Number(ticket[4]),
          numberOfTicket: Number(ticket[5]),
        };
        const userTicket = await getUserTicket(ticketDetails.buyer);
        return { ...ticketDetails, ...userTicket };
      } catch (error) {
        console.error(
          `Failed to fetch user ticket for buyer ${ticket[2]}:`,
          error,
        );
        return null;
      }
    });

    const ticketsWithUserDetails = await Promise.all(promises);

    // Filter out any null entries (failed fetches)
    const validTickets = ticketsWithUserDetails.filter(
      (ticket) => ticket !== null,
    );

    // Consolidate tickets by buyer
    const consolidatedTickets = validTickets.reduce((acc, ticket) => {
      const existingTicket = acc.find(
        (t: any) => t.buyer === ticket.buyer && t.eventId === ticket.eventId,
      );
      if (existingTicket) {
        existingTicket.numberOfTicket += ticket.numberOfTicket;
      } else {
        acc.push(ticket);
      }
      return acc;
    }, []);

    return consolidatedTickets;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const getAllTicketsOfAnEvent = async (eventId: number) => {
  try {
    if (!window.ethereum) {
      throw new Error("Please install a browser provider");
    }

    // Retrieve all tickets
    const allTickets = await getAllTickets();

    if (!allTickets) {
      console.log("No tickets here");
      return;
    }

    // Filter tickets by eventId
    const eventTickets = allTickets?.filter(
      (ticket: any) => Number(ticket.eventId) === Number(eventId),
    );

    return eventTickets;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const joinGroup = async (eventId: number) => {
  try {
    if (!window.ethereum) {
      throw new Error("Please install a browser provider");
    }

    const contract = await getBlumaContracts();
    const joined = await contract.joinGroup(Number(eventId));

    const result = await joined.wait();

    if (!result.status) {
      console.log("Could not join space");
      return false;
    }

    return true;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const getAllGroupMessages = async (groupId: number) => {
  try {
    if (!window.ethereum) {
      throw new Error("Please install a browser provider");
    }

    const contract = await getBlumaContracts();
    const groupMessages = await contract.getGroupMessages(Number(groupId));

    if (!groupMessages) {
      console.log("No groups found");
      return [];
    }

    const redefinedGroupMessages: IRoomMessages[] = await Promise.all(
      groupMessages.map(async (message: any) => {
        const structuredMessage: IRoomMessages = {
          sender: String(message[0]),
          email: String(message[1]),
          text: String(message[2]),
          timestamp: Number(message[3]),
        };

        const user = await getUser(structuredMessage.sender);

        return {
          ...structuredMessage,
          ...user,
        };
      }),
    );

    return redefinedGroupMessages;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const sendMessage = async (groupId: number, msg: string) => {
  try {
    if (!window.ethereum) {
      throw new Error("Please install a browser provider");
    }
    console.log("GETTING CONTRACT...");
    const contract = await getBlumaContracts();
    console.log("CONTRACT IS AVAILABLE...");
    console.log("SENDING MESSAGE...");
    const message = await contract.groupChat(groupId, msg);
    console.log("MESSAGE SENT...");

    console.log("WAITING FOR TRANSACTION...");
    const result = await message.wait();
    console.log("TRANSACTION SENT...");

    if (!result.status) {
      return { success: false };
    } else {
      return { success: true };
    }
  } catch (error) {
    console.log("FAILED SENDING MESSAGE...", {
      errorMessage: error,
      msg,
      groupId,
    });
    reportError(error);
    throw error;
  }
};

export const withdrawEventFee = async (eventId: number) => {
  if (!window.ethereum) throw new Error("Please install a browser provider");

  try {
    const contract = await getBlumaContracts();
    const withdraw = await contract.withdrawEventFee(Number(eventId));

    const result = await withdraw.wait();

    if (!result.status) {
      console.log("Failed to withdraw event fee");
      return false;
    }

    return true;
  } catch (error) {
    reportError(error);
    throw error;
  }
};
