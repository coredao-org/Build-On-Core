import Ripple from "@/components/magicui/ripple";
import Link from "next/link";
import { Button } from "../ui/button";

export default function RippleDemo() {
  return (
    <div className="relative flex h-[500px] w-1/2 flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
      <Link
        href={"./lms/Vrlms"}
        className="z-10 whitespace-pre-wrap text-center text-5xl font-medium tracking-tighter text-white"
      >
        Join in Web
      </Link>
      <Button className="bg-white/80 hover:cursor-pointer z-50  mt-10">
        <Link href={"./lms/vrLms"}> Join fast</Link>
      </Button>
      <Ripple />
    </div>
  );
}
