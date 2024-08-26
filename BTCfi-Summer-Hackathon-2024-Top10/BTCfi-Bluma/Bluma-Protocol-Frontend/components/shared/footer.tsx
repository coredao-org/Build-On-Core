"use client";

import Logo from "./logo";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const footer_links = [
  {
    name: "What's New",
    path: "/update",
  },
  {
    name: "Discover",
    path: "/discover",
  },
  {
    name: "Support",
    path: "/donate",
  },
  {
    name: "Help",
    path: "/help",
  },
];

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer className="py-6 mt-auto border-t flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 flex-wrap flex-col md:flex-row">
        <div className="flex items-center gap-2 flex-col sm:gap-4 sm:flex-row">
          <Logo />

          <div className="flex items-center gap-4">
            {footer_links.map((link) => {
              const isActive = link.path === pathname;

              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={cn(
                    "flex items-center text-muted-foreground hover:text-primary transition-colors duration-300",
                    {
                      "text-initial hover:text-initial": isActive,
                    }
                  )}>
                  <p className="text-xs md:text-sm capitalize font-normal">
                    {link.name}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-start gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            className="text-muted-foreground hover:text-primary transition-colors duration-300 w-4 h-4 cursor-pointer">
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M7 2.5h2c1.436 0 2.4.002 3.134.077.71.072 1.038.2 1.255.344a2.5 2.5 0 0 1 .69.69c.145.217.272.545.344 1.255.075.734.077 1.698.077 3.134s-.002 2.4-.077 3.134c-.072.71-.2 1.038-.344 1.255a2.5 2.5 0 0 1-.69.69c-.217.145-.545.272-1.255.344-.735.075-1.698.077-3.134.077H7c-1.436 0-2.4-.002-3.134-.077-.71-.072-1.038-.2-1.255-.344a2.5 2.5 0 0 1-.69-.69c-.145-.217-.272-.545-.344-1.255C1.502 10.4 1.5 9.436 1.5 8s.002-2.4.077-3.134c.072-.71.2-1.038.344-1.255a2.5 2.5 0 0 1 .69-.69c.217-.145.545-.272 1.255-.344C4.6 2.502 5.564 2.5 7 2.5ZM0 8c0-2.809 0-4.213.674-5.222a4 4 0 0 1 1.104-1.104C2.787 1 4.19 1 7 1h2c2.809 0 4.213 0 5.222.674.437.292.812.667 1.104 1.104C16 3.787 16 5.19 16 8c0 2.809 0 4.213-.674 5.222a4.003 4.003 0 0 1-1.104 1.104C13.213 15 11.81 15 9 15H7c-2.809 0-4.213 0-5.222-.674a4.002 4.002 0 0 1-1.104-1.104C0 12.213 0 10.81 0 8Zm5.458-2.594a.75.75 0 0 0-.916 1.188l2.282 1.757.004.004a1.963 1.963 0 0 0 2.363 0l.007-.006 2.262-1.757a.75.75 0 1 0-.92-1.184L8.282 7.16a.463.463 0 0 1-.546 0L5.458 5.406Z"></path>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 330 330"
            className="text-muted-foreground hover:text-primary transition-colors duration-300 w-4 h-4 cursor-pointer">
            <path
              fill="currentColor"
              d="M68 290.485c-5.5 9.6-17.8 12.8-27.3 7.3-9.6-5.5-12.8-17.8-7.3-27.3l14.3-24.7c16.1-4.9 29.3-1.1 39.6 11.4l-19.3 33.3Zm138.9-53.9H25c-11 0-20-9-20-20s9-20 20-20h51l65.4-113.2-20.5-35.4c-5.5-9.6-2.2-21.8 7.3-27.3 9.6-5.5 21.8-2.2 27.3 7.3l8.9 15.4 8.9-15.4c5.5-9.6 17.8-12.8 27.3-7.3 9.6 5.5 12.8 17.8 7.3 27.3l-85.8 148.6h62.1c20.2 0 31.5 23.7 22.7 40Zm98.1 0h-29l19.6 33.9c5.5 9.6 2.2 21.8-7.3 27.3-9.6 5.5-21.8 2.2-27.3-7.3-32.9-56.9-57.5-99.7-74-128.1-16.7-29-4.8-58 7.1-67.8 13.1 22.7 32.7 56.7 58.9 102h52c11 0 20 9 20 20 0 11.1-9 20-20 20Z"></path>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            className="text-muted-foreground hover:text-primary transition-colors duration-300 w-4 h-4 cursor-pointer">
            <path
              fill="currentColor"
              d="M6.278 18.5A11.33 11.33 0 0 1 0 16.605c1.54.103 4.256-.144 5.945-1.812-2.541-.12-3.688-2.138-3.837-3 .216.086 1.246.19 1.827-.052C1.011 10.983.563 8.328.662 7.517c.549.397 1.479.535 1.845.5C-.218 6 .762 2.966 1.244 2.31c1.955 2.803 4.885 4.378 8.51 4.465a4.48 4.48 0 0 1-.104-.965c0-2.38 1.86-4.31 4.153-4.31 1.199 0 2.279.527 3.037 1.37.8-.195 2.006-.65 2.595-1.042-.297 1.103-1.221 2.024-1.78 2.365.004.011-.005-.012 0 0 .49-.077 1.82-.342 2.345-.71-.26.62-1.24 1.65-2.044 2.227.15 6.831-4.901 12.79-11.678 12.79Z"></path>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            className="text-muted-foreground hover:text-primary transition-colors duration-300 w-4 h-4 cursor-pointer">
            <g fill="currentColor" fillRule="evenodd">
              <path
                fillRule="nonzero"
                d="M13.38 3.8a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z"></path>
              <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0-1.6a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z"></path>
              <path d="M0 7.68c0-2.688 0-4.032.523-5.06A4.8 4.8 0 0 1 2.621.524C3.648 0 4.99 0 7.68 0h.64c2.688 0 4.032 0 5.06.523a4.8 4.8 0 0 1 2.097 2.098C16 3.648 16 4.99 16 7.68v.64c0 2.688 0 4.032-.523 5.06a4.8 4.8 0 0 1-2.098 2.097C12.352 16 11.01 16 8.32 16h-.64c-2.688 0-4.032 0-5.06-.523a4.8 4.8 0 0 1-2.097-2.098C0 12.352 0 11.01 0 8.32v-.64ZM7.68 1.6h.64c1.37 0 2.302.001 3.022.06.702.057 1.06.161 1.31.289a3.2 3.2 0 0 1 1.4 1.398c.127.25.23.61.288 1.31.059.72.06 1.652.06 3.023v.64c0 1.37-.001 2.302-.06 3.022-.057.702-.161 1.06-.289 1.31a3.2 3.2 0 0 1-1.398 1.4c-.25.127-.61.23-1.31.288-.72.059-1.652.06-3.023.06h-.64c-1.37 0-2.302-.001-3.022-.06-.702-.057-1.06-.161-1.31-.289a3.2 3.2 0 0 1-1.4-1.398c-.127-.25-.23-.61-.288-1.31-.059-.72-.06-1.652-.06-3.023v-.64c0-1.37.001-2.302.06-3.022.057-.702.161-1.06.289-1.31a3.2 3.2 0 0 1 1.398-1.4c.25-.127.61-.23 1.31-.288.72-.059 1.652-.06 3.023-.06Z"></path>
            </g>
          </svg>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <Link
          href="/create"
          className="text-sm text-transparent bg-clip-text bg-gradient-to-r w-max"
          style={{
            background:
              "linear-gradient(45deg, rgb(12, 171, 247) 40%, rgb(226, 116, 23), rgb(31, 111, 5)) text",
          }}>
          Host your event with Bluma ↗
        </Link>
      </div>
    </footer>
  );
}
