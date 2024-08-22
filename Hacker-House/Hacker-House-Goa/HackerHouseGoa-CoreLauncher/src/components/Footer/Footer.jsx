import React from "react";
import Container from "../Container/Container";
import Image from "next/image";
import Link from "next/link";
import { Telegram, X } from "iconoir-react";

const Footer = () => {
  return (
    <footer className="relative py-14">
      <Container>
        <div className="relative bg-light dark:bg-dark rounded-3xl p-10 max-sm:p-5 transition-colors duration-300">
          <Image
            src="/images/logo.png"
            alt=""
            width={200}
            height={200}
            className="w-44 mb-5"
          />
          <div className="flex items-center flex-wrap gap-2">
            <Link
              href="https://x.com/Coredao_Org"
              target="_blank"
              rel="noReferrer"
              className="w-10 h-10 rounded-full text-xs inline-flex items-center justify-center text-black dark:text-white hover:text-purple-600 transition-all duration-300"
            >
              <X />
            </Link>
            <Link
              href="https://t.me/CoreDAOTelegram"
              target="_blank"
              rel="noReferrer"
              className="w-10 h-10 rounded-full text-xs inline-flex items-center justify-center text-black dark:text-white hover:text-purple-600 transition-all duration-300"
            >
              <Telegram />
            </Link>
          </div>
          <div className="relative flex items-center justify-between max-sm:flex-col max-sm:items-start gap-5 mt-14 max-sm:mt-8">
            <ul className="flex items-center gap-8">
              <li className="block">
                <Link
                  href="/"
                  target="_blank"
                  rel="noReferrer"
                  className="block text-sm hover:text-purple-500"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li className="block">
                <Link
                  href="/"
                  target="_blank"
                  rel="noReferrer"
                  className="block text-sm hover:text-purple-500"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
            <div className="flex items-center flex-wrap gap-2">
              <p className="text-sm">
                &copy; {new Date().getFullYear()} Core Launcher
              </p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
