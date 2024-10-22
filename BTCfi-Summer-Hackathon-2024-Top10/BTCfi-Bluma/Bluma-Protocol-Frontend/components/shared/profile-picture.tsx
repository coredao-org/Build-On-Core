import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePicture({ src, initials, size }: IAvatar) {
  return (
    <Avatar
      className={`cursor-pointer ${
        size === "sm" ? "w-[30px] h-[30px]" : "w-10 h-10"
      }`}>
      <AvatarImage src={src} alt={initials} />
      <AvatarFallback className={size === "sm" ? "text-sm" : "text-base"}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
