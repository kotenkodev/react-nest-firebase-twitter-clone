import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/getInitials";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import TransitionLink from "../TransitionLink";
import { cn } from "@/lib/utils";

dayjs.extend(relativeTime);

interface PostAuthorProps {
  authorId: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string;
  createdAt: Date | string;
  isEdited?: boolean;
  updatedAt?: Date | string;
  avatarSize?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-8 w-8 text-[10px]",
  md: "h-10 w-10 text-xs",
  lg: "h-12 w-12 text-sm",
};

export function PostAuthor({
  authorId,
  firstName,
  lastName,
  photoURL,
  createdAt,
  isEdited,
  updatedAt,
  avatarSize = "md",
  className,
}: PostAuthorProps) {
  const fullName =
    `${firstName || ""} ${lastName || ""}`.trim() || "Unknown User";

  return (
    <TransitionLink
      to={`/profile/${authorId}`}
      className={cn(
        "flex items-center gap-3 w-fit self-start no-underline group",
        className,
      )}
    >
      <Avatar className={cn("border shadow-sm shrink-0", sizeMap[avatarSize])}>
        <AvatarImage src={photoURL} alt={firstName} className="object-cover" />
        <AvatarFallback className="bg-secondary text-secondary-foreground font-bold">
          {getInitials(fullName)}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col justify-center">
        <span
          className={cn(
            "font-bold tracking-tight text-foreground leading-tight group-hover:underline",
            avatarSize === "lg" ? "text-base" : "text-sm",
          )}
        >
          {fullName}
        </span>
        <span className="text-xs text-muted-foreground mt-0.5 select-none">
          {dayjs(createdAt).fromNow()}
          {isEdited && updatedAt && (
            <span
              className="ml-1 text-[10px] italic font-normal text-muted-foreground/80 cursor-help"
              title={`Edited on ${dayjs(updatedAt).format("MMM D, YYYY h:mm A")}`}
            >
              (edited)
            </span>
          )}
        </span>
      </div>
    </TransitionLink>
  );
}
