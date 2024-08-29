"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

import { cn, shortenAddress } from "@/lib/utils";

//? ICONS
import { RiSearch2Line } from "react-icons/ri";
import ProfilePicture from "./profile-picture";
import { Button } from "../ui/button";
import { Bell, Plus } from "lucide-react";
import { nav_links } from "@/constants";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./logo";
import { useGlobalContext } from "@/providers/global-provider";
import { useWeb3Modal } from "@web3modal/ethers/react";
import { LogOutModal } from "./logout-modal";
import { CgMenuRightAlt } from "react-icons/cg";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Header() {
  const pathname = usePathname();

  const { open } = useWeb3Modal();

  const { isAuthenticated, credentials } = useGlobalContext();

  return (
    <header className="px-4 py-3 flex items-center justify-between md:justify-normal bg-background gap-6 md:gap-0 sticky top-0 z-50">
      <div className="w-max xl:w-[350px]">
        <Logo />
      </div>

      {isAuthenticated && (
        <nav
          className={cn(
            "hidden md:flex items-center justify-start gap-4 px-4 mx-auto w-full max-w-full lg:max-w-[820px]",
            {
              "lg:max-w-[960px]":
                pathname === "/" ||
                pathname === "/create" ||
                pathname === "/market" ||
                pathname.includes("/event"),
              "lg:max-w-[640px]": pathname.includes("/profile"),
            }
          )}>
          {nav_links.map((link) => {
            const isActive = pathname.includes(link.path);

            return (
              <Link
                key={link.path}
                href={
                  link.path === "/profile"
                    ? `/profile/${credentials?.address}`
                    : link.path
                }
                className={cn(
                  "flex items-center text-muted-foreground hover:text-primary transition-colors duration-300",
                  {
                    "text-primary hover:text-primary": isActive,
                  }
                )}>
                <link.icon className="w-4 h-4 mr-1.5" />
                <p className="text-xs md:text-sm capitalize font-semibold">
                  {link.name}
                </p>
              </Link>
            );
          })}
        </nav>
      )}

      <div
        className={cn("flex items-center gap-4 w-[350px] justify-end", {
          "w-[380px] ml-auto": !isAuthenticated,
        })}>
        {!isAuthenticated ? (
          <Button
            size="sm"
            className="h-[30px]"
            variant={pathname === "/sign-in" ? "default" : "outline"}
            asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        ) : (
          <>
            <Link
              href="/create"
              className="text-xs md:text-sm font-semibold text-primary/80 hover:text-primary transition-colors duration-300 hidden md:flex">
              Create Event
            </Link>

            <RiSearch2Line
              size={16}
              className="text-muted-foreground hover:text-primary transition-all cursor-pointer hidden md:flex"
            />

            <Bell
              size={16}
              className="text-muted-foreground hover:text-primary transition-all cursor-pointer hidden md:flex"
            />

            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full">
                <ProfilePicture
                  size="sm"
                  src={`https://blue-quickest-opossum-600.mypinata.cloud/ipfs/${credentials?.avatar ||"QmZVMhaKF2e3fQMD8Yzbq7Kx6WrgEwZH3EvqbaJ8UGQbiV"}`}
                  initials={"AS"}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-4 mt-2 w-[260px]">
                <DropdownMenuItem asChild>
                  <Link
                    href={`/profile/${credentials?.address}`}
                    className="flex items-center gap-3 flex-1 p-3 hover:bg-secondary/50 rounded-sm">
                    <ProfilePicture
                      size="default"
                      src={`https://blue-quickest-opossum-600.mypinata.cloud/ipfs/${credentials?.avatar ||"QmZVMhaKF2e3fQMD8Yzbq7Kx6WrgEwZH3EvqbaJ8UGQbiV"}`}
                      initials={"AS"}
                    />

                    <div className="flex flex-col whitespace-pre-wrap w-full overflow-x-hidden">
                      <p className="text-sm truncate font-semibold flex-1">
                        {credentials && credentials?.email
                          ? credentials?.email
                          : "anonymous@example.com"}
                      </p>
                      <p className="text-xs truncate font-semibold flex-1 text-muted-foreground">
                        {credentials && credentials?.address
                          ? shortenAddress(credentials?.address)
                          : shortenAddress(
                              "0x0000000000000000000000000000000000000000"
                            )}
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="py-2 px-3 text-[13px] cursor-pointer font-medium"
                  asChild>
                  <Link href={`/profile/${credentials?.address}`}>
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="py-2 px-3 text-[13px] cursor-pointer font-medium"
                  onClick={async () => await open()}>
                  Wallet
                </DropdownMenuItem>
                {credentials?.address ===
                  process.env.NEXT_PUBLIC_ADMIN_ADDRESS && (
                  <DropdownMenuItem
                    className="py-2 px-3 text-[13px] cursor-pointer font-medium"
                    asChild>
                    <Link href="/admin/all-users">Accounts</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <LogOutModal />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet>
              <SheetTrigger className="flex md:hidden">
                <CgMenuRightAlt size={17} className="text-primary" />
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col mt-10 w-full">
                  {nav_links.map((link) => {
                    const isActive = pathname.includes(link.path);

                    return (
                      <SheetClose key={link.path} asChild>
                        <Link
                          href={
                            link.path === "/profile"
                              ? `/profile/${credentials?.address}`
                              : link.path
                          }
                          className={cn(
                            "flex items-center text-muted-foreground hover:text-primary transition-colors duration-300 py-3 border-b",
                            {
                              "text-primary hover:text-primary": isActive,
                            }
                          )}>
                          <link.icon size={16} className="mr-2" />
                          <p className="text-sm capitalize font-medium">
                            {link.name}
                          </p>
                        </Link>
                      </SheetClose>
                    );
                  })}
                  <SheetClose asChild>
                    <Link
                      href="/create"
                      className={cn(
                        "flex items-center text-muted-foreground hover:text-primary transition-colors duration-300 py-3",
                        {
                          "text-primary hover:text-primary":
                            pathname === "/create",
                        }
                      )}>
                      <Plus size={16} className="mr-2" />
                      <p className="text-sm capitalize font-medium">
                        Create Event
                      </p>
                    </Link>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </>
        )}
      </div>
    </header>
  );
}
