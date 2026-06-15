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
import type { Post } from "@/types/post";
import { useAuthStore } from "@/store/useAuthStore";
import { PostCardSkeleton } from "@/components/post/PostCardSkeleton";

const DUMMY_POSTS: Post[] = [
  {
    id: "1",
    title: "First Post",
    author: {
      firstName: "John",
      lastName: "Doe",
      photoURL: "https://via.placeholder.com/150",
    },
    content: "This is the first post.",
    photoURL: "https://dummyjson.com/image/400x200/282828",
    commentsCount: 0,
    likesCount: 0,
    createdAt: new Date("2024-06-01T10:00:00Z"),
    authorId: "1",
    dislikesCount: 0,
  },
  {
    id: "2",
    title: "Second Post",
    author: {
      firstName: "John",
      lastName: "Doe",
      photoURL: "https://via.placeholder.com/150",
    },
    content: "This is the second post.",
    photoURL: "https://dummyjson.com/image/400x200/282828",
    commentsCount: 0,
    likesCount: 0,
    createdAt: new Date("2024-06-01T10:00:00Z"),
    authorId: "2",
    dislikesCount: 0,
  },
  {
    id: "3",
    title:
      "Really long post name lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    content:
      "Really long description lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    author: {
      firstName: "John",
      lastName: "Doe",
      photoURL: "https://via.placeholder.com/150",
    },
    photoURL: "https://dummyjson.com/image/400x200/282828",
    commentsCount: 10,
    likesCount: 0,
    createdAt: new Date("2024-06-01T10:00:00Z"),
    authorId: "3",
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
            <PostCardSkeleton />
            {DUMMY_POSTS.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
