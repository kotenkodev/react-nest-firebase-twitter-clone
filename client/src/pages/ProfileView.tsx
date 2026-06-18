import { Container } from "@/components/ui/container";
import ProfileCard from "@/components/ProfileCard";
import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { getUser } from "@/services/usersService";
import type { User } from "@/types/user.types";
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

  const fetchUserPosts = useCallback(({ pageParam }: { pageParam?: string }) => {
    return getPosts({ pageParam });
  }, []);

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
          <p className="text-muted-foreground max-w-75 mx-auto">
            The profile you're looking for doesn't exist or has moved to another
            branch.
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
    <Container className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
      <aside className="lg:col-span-4 lg:sticky top-26">
        <ProfileCard user={userProfile} />
      </aside>

      <main className="lg:col-span-8 space-y-6">
        <Card className="border-muted/60 shadow-sm overflow-hidden">
          <CardHeader className="pb-4 border-b border-muted bg-muted/10">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Posts
            </CardTitle>
            <CardDescription>
              Check out what {userProfile.firstName} has been sharing lately.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 sm:p-6 md:p-8">
            <PostList
              fetchAction={fetchUserPosts}
              emptyMessage={`${userProfile.firstName} hasn't posted anything yet.`}
            />
          </CardContent>
        </Card>
      </main>
    </Container>
  );
}
