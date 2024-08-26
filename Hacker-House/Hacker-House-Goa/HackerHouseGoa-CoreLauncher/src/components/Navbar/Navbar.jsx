"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "../Container/Container";
import { usePathname } from "next/navigation";
import { MenuScale, Wallet } from "iconoir-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import ThemeToggler from "../ThemeToggler/ThemeToggler";

const Navbar = () => {
  const pathname = usePathname();
  // console.log({ pathname });
  const [menuToggle, setMenuToggle] = useState(false);

  return (
    <header className="relative w-full py-4">
      <Container fluid>
        <div className="relative flex items-center justify-between gap-5">
          <Link href="/" className="block">
            <Image
              src="/images/logo.png"
              alt=""
              width={200}
              height={200}
              priority
              className="w-57"
            />
          </Link>
          <div className="relative flex items-center gap-2">
            {pathname == "/createtoken" && <ThemeToggler />}
            <div className="block">
              {pathname == "/createtoken" ? (
                <ConnectButton />
              ) : (
                <Link href="/createtoken" className="button button-primary">
                  Launch App
                </Link>
              )}
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Navbar;
