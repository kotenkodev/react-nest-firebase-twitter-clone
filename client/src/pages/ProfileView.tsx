import { Container } from "@/components/ui/container";
import ProfileCard from "@/components/ProfileCard";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUser } from "@/services/usersService";
import type { User } from "@/types/user";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import PostList from "@/components/post/PostList";
import { getPosts } from "@/services/postsService";
import { BirdSpinner } from "@/components/ui/bird-spinner";
import { buttonVariants } from "@/components/ui/button";
import TransitionLink from "@/components/TransitionLink";

export default function Profile() {
  const { id } = useParams();
  const user = useAuthStore((state) => state.user);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userProfile) {
      document.title = `${userProfile.firstName} ${userProfile.lastName}'s Profile / Birb`;
    } else {
      document.title = "Profile / Birb";
    }
  }, [userProfile]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const data = await getUser(id || user?.id);
        setUserProfile(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id, user?.id]);

  if (isLoading) {
    return (
      <Container className="flex items-center justify-center min-h-[50vh]">
        <BirdSpinner size={48} label="Finding user..." />
      </Container>
    );
  }

  if (!userProfile) {
    return (
      <Container className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="relative">
          <h3 className="text-8xl font-black text-muted-foreground/5 absolute -top-8 left-1/2 -translate-x-1/2 select-none">
            404
          </h3>
          <BirdSpinner size={64} label="" className="relative z-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold tracking-tight">User not found</h3>
          <p className="text-muted-foreground max-w-[300px] mx-auto">
            The profile you're looking for doesn't exist or has moved to another branch.
          </p>
        </div>
        <TransitionLink
          to="/"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          Back to Home
        </TransitionLink>
      </Container>
    );
  }

  return (
    <Container className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="sticky top-20">
        <ProfileCard user={userProfile} />
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold tracking-tight">Posts</CardTitle>
            <CardDescription>
              View all posts made by {userProfile.firstName}{" "}
              {userProfile.lastName}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <PostList
              fetchAction={() => getPosts()}
              emptyMessage="No posts to show"
            />
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
