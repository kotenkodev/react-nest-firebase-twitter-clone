import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { User } from "@/types/user";
import { getInitials } from "@/utils/getInitials";
import { BadgeCheck, CalendarDays } from "lucide-react";

export default function ProfileCard({ user }: { user: User }) {
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-sm">
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
          <Avatar className="w-32 h-32 sm:w-48 sm:h-48 shrink-0 border border-muted shadow-sm">
            <AvatarImage
              src={user?.photoURL}
              alt={user?.email}
              className="object-cover"
            />
            <AvatarFallback className="text-4xl sm:text-5xl font-semibold text-muted-foreground">
              {getInitials(`${user.firstName} ${user.lastName}`)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-4 w-full sm:pt-2">
            <div>
              <h2 className="flex items-center gap-1.5 text-2xl sm:text-3xl font-bold tracking-tight">
                <span className="truncate">
                  {user.firstName} {user.lastName}
                </span>
                {user.emailVerified && (
                  <BadgeCheck
                    className="w-6 h-6 text-blue-500 shrink-0"
                    aria-label="Verified Account"
                  />
                )}
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base truncate mt-1">
                {user.email}
              </p>
            </div>

            <div>
              {user.bio ? (
                <p className="text-sm sm:text-base text-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {user.bio}
                </p>
              ) : (
                <p className="text-sm sm:text-base text-muted-foreground italic">
                  No bio provided.
                </p>
              )}
            </div>

            {user.birthDate && (
              <div className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground pt-2">
                <CalendarDays className="w-4 h-4 opacity-70" />
                <span>
                  Born{" "}
                  {user.birthDate.toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
