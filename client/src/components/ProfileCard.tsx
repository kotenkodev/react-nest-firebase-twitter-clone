import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { User } from "@/types/user";
import { getInitials } from "@/utils/getInitials";

export default function ProfileCard({ user }: { user: User }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>aaa iii</CardTitle>
        <CardDescription>gfdgdgf</CardDescription>
      </CardHeader>
      <CardContent>
        <Avatar className="w-32 h-32 ">
          <AvatarImage src={user?.photoUrl} alt={user?.email} />
          <AvatarFallback>
            {getInitials(`${user.firstName} ${user.lastName}`)}
          </AvatarFallback>
        </Avatar>
      </CardContent>
      <CardFooter>
        <span> Posts</span>
      </CardFooter>
    </Card>
  );
}
