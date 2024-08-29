"use client";

import { site } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Logo() {
  const pathname = usePathname();

  return (
    <Link
      href={pathname === "/" || pathname === "/home" ? "/" : "/home"}
      className="w-max flex items-center gap-2">
      <h1 className="text-base font-bold">{site.name}</h1>
    </Link>
  );
}
