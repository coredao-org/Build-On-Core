"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { shortenAddress } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/constants";
import {
  getAllEvents,
  getAllTickets,
  getAllUsers,
  getUserTicket,
} from "@/services/bluma-contract";

interface IUserWithDetails {
  address: string;
  avatar: string;
  balance: number;
  hostedEvents: number;
  attendedTickets: number;
}

export default function AllUsersPage() {
  const [allUsers, setAllUsers] = useState<IUserWithDetails[]>([]);
  const [isFetchingUsers, setIsFetchingUsers] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const users: any = await getAllUsers();
        const events = await getAllEvents();

        const userWithDetailsPromises = users.map(async (user: any) => {
          const tickets = await getAllTickets();

          const attendedTickets = tickets?.filter(
            (ticket: any) => ticket?.buyer === user?.address
          ).length;

          return {
            address: user?.address,
            avatar: user.avatar,
            balance: user.balance,
            hostedEvents:
              events?.filter(
                (event: IEvent) => event?.owner?.address === user?.address
              )?.length || 0,
            attendedTickets: attendedTickets || 0,
          };
        });

        const userWithDetails = await Promise.all(userWithDetailsPromises);

        setAllUsers(userWithDetails);
      } catch (error) {
        console.error("ERROR FETCHING USERS: ", error);
      } finally {
        setIsFetchingUsers(false);
      }
    })();
  }, []);

  return (
    <div className="flex flex-col p-4">
      <Table>
        <TableCaption>
          {isFetchingUsers
            ? "Fetching all users..."
            : `A list of all the users in ${site.name}.`}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[130px] sm:w-[180px]">Address</TableHead>
            <TableHead>Hosted</TableHead>
            <TableHead>Attended</TableHead>
            <TableHead className="text-right">Earnings</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isFetchingUsers
            ? Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="flex items-center gap-2">...</TableCell>
                  <TableCell>...</TableCell>
                  <TableCell>...</TableCell>
                  <TableCell className="text-right">...</TableCell>
                </TableRow>
              ))
            : allUsers.map((user) => (
                <TableRow key={user.address}>
                  <TableCell className="flex items-center gap-2">
                    <div className="size-5 rounded-full bg-secondary">
                      <Image
                        src={`https://blue-quickest-opossum-600.mypinata.cloud/ipfs/${user.avatar || "QmZVMhaKF2e3fQMD8Yzbq7Kx6WrgEwZH3EvqbaJ8UGQbiV"}`}
                        alt={user.address}
                        width={20}
                        height={20}
                        className="rounded-[inherit] object-cover"
                        priority
                      />
                    </div>
                    <Link
                      href={`/profile/${user.address}`}
                      className="text-xs md:text-sm font-semibold hover:underline">
                      {shortenAddress(user.address)}
                    </Link>
                  </TableCell>
                  <TableCell>{user.hostedEvents}</TableCell>
                  <TableCell>{user.attendedTickets}</TableCell>
                  <TableCell className="text-right">
                    <b>{user.balance}</b> BLM
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
        {!isFetchingUsers && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  );
}
