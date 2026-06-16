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
import PostCard from "@/components/post/PostCard";
import { useAuthStore } from "@/store/useAuthStore";
import { PostCardSkeleton } from "@/components/post/PostCardSkeleton";
import PostList from "@/components/post/PostList";
import { getPosts } from "@/services/postsService";

export default function Profile() {
  const { id } = useParams();
  const { user } = useAuthStore((state) => state.user);
  const [userProfile, setUserProfile] = useState<User | null>(null);

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
        const data = await getUser(id || user?.id);
        setUserProfile(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [id, setUserProfile, user?.id]);

  if (!userProfile) {
    return (
      <Container className="mt-10">
        <p className="text-center text-muted-foreground">User not found.</p>
      </Container>
    );
  }

  return (
    <Container className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div className="sticky top-20">
        <ProfileCard user={userProfile} />
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Posts</CardTitle>
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
