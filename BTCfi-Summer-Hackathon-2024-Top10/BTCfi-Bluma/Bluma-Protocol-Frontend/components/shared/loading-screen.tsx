import { Loader } from "lucide-react";
import React from "react";

export default function LoadingScreen({ text }: { text?: string }) {
  return (
    <div className="flex-1 bg-background flex items-center justify-center flex-col z-50 size-full fixed top-0 left-0">
      <Loader size={26} className="animate-spin" />
      <p className="text-sm mt-1">{text}</p>
    </div>
  );
}
