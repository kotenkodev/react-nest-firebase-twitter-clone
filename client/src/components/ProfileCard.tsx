import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { User } from "@/types/user";
import { getInitials } from "@/utils/getInitials";
import { BadgeCheck, CalendarDays, Mail } from "lucide-react";

export default function ProfileCard({ user }: { user: User }) {
  return (
    <Card className="w-full shadow-sm border-muted/60 overflow-hidden">
      <div className="h-24 bg-linear-to-r from-primary/20 to-primary/5 border-b" />
      <CardContent className="p-6 pt-0 relative">
        <div className="flex flex-col gap-5">
          <div className="relative -mt-12 flex justify-between items-end px-2">
            <Avatar className="w-28 h-24 sm:w-32 sm:h-32">
              <AvatarImage
                src={user?.photoURL}
                alt={user?.email}
                className="object-cover"
              />
              <AvatarFallback className="text-3xl font-bold ">
                {getInitials(`${user.firstName} ${user.lastName}`)}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="flex items-center gap-1.5 text-2xl font-bold tracking-tight text-foreground">
                <span className="truncate">
                  {user.firstName} {user.lastName}
                </span>
                {user.emailVerified && (
                  <BadgeCheck
                    className="w-5 h-5 text-primary shrink-0"
                    aria-label="Verified Account"
                  />
                )}
              </h2>
              <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate">{user.email}</span>
              </div>
            </div>

            <div className="py-1">
              {user.bio ? (
                <p className="break-all text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                  {user.bio}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No bio provided yet.
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2 border-t border-muted/40">
              {user.birthDate && (
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <CalendarDays className="w-3.5 h-3.5 opacity-70" />
                  <span>
                    Born{" "}
                    {user.birthDate.toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
