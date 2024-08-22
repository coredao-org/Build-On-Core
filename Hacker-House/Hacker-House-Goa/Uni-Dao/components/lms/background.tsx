"use client";
import React from "react";
import { Boxes } from "../ui/background-boxes";
import { cn } from "@/lib/utils";
import VrLms from '@/components/lms/VrLms'
import WebLms from "@/components/lms/WebLms"


export default function BackgroundBoxesDemo() {
  return (
    <div className="h-full  relative -z-10 w-full overflow-hidden bg-black flex flex-col items-center justify-center rounded-lg">
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />

      <Boxes />

<div className="w-[70%] z-30  flex gap-3 justify-center">
<VrLms/>

<WebLms/>
</div>
     
    </div>
  );
}
