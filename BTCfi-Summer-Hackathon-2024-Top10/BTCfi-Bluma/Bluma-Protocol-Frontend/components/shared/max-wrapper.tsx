"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function MaxWrapper({ children, className }: IWrapper) {
  const pathname = usePathname();

  return (
    <section
      className={cn("mx-auto md:px-4 w-full max-w-[820px]", className, {
        "max-w-[960px]":
          pathname === "/" ||
          pathname === "/create" ||
          pathname === "/market" ||
          pathname.includes("/event"),
        "max-w-[640px]": pathname.includes("/profile"),
      })}>
      {children}
    </section>
  );
}
