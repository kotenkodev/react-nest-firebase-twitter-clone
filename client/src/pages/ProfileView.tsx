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
import PostCard from "@/components/PostCard";
import type { Post } from "@/types/post";
import { useAuthStore } from "@/store/useAuthStore";

const DUMMY_POSTS: Post[] = [
  {
    id: "1",
    title: "First Post",
    content: "This is the first post.",
    photoURL: "https://dummyjson.com/image/400x200/282828",
    commentsCount: 0,
    likesCount: 0,
    createdAt: new Date(),
    authorId: "",
    dislikesCount: 0,
  },
  {
    id: "2",
    title: "Second Post",
    content: "This is the second post.",
    photoURL: "https://dummyjson.com/image/400x200/282828",
    commentsCount: 0,
    likesCount: 0,
    createdAt: new Date(),
    authorId: "",
    dislikesCount: 0,
  },
  {
    id: "3",
    title: "Third Post",
    content: "This is the third post.",
    photoURL: "https://dummyjson.com/image/400x200/282828",
    commentsCount: 10,
    likesCount: 0,
    createdAt: new Date(),
    authorId: "",
    dislikesCount: 0,
  },
];

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
            {DUMMY_POSTS.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
