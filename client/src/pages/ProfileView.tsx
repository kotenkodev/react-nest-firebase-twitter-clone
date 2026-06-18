import { Container } from "@/components/ui/container";
import ProfileCard from "@/components/ProfileCard";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PostList from "@/components/post/PostList";
import { getPosts } from "@/services/postsService";
import { BirdSpinner } from "@/components/ui/bird-spinner";
import ItemNotFound from "@/components/ItemNotFound";
import { useUser } from "@/hooks/users/useUser";

export default function Profile() {
  const { id } = useParams();

  const { user, error, isPending } = useUser(id);

  useEffect(() => {
    if (user) {
      document.title = `${user.firstName} ${user.lastName}'s Profile / Birb`;
    } else {
      document.title = "Profile / Birb";
    }
  }, [user]);

  if (error) {
    return (
      <Container className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <ItemNotFound
          title="Error Loading Profile"
          message="An error occurred while fetching the user profile. Please try again later."
          errorCode="500"
          backLinkText="Back to Home"
          backLinkTo="/"
        />
      </Container>
    );
  }

  if (isPending) {
    return (
      <Container className="flex items-center justify-center min-h-[50vh]">
        <BirdSpinner size={48} label="Finding user..." />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <ItemNotFound
          title="User Not Found"
          message="The user you are looking for might have been deleted or moved to another nest."
          errorCode="404"
          backLinkText="Back to Home"
          backLinkTo="/"
        />
      </Container>
    );
  }

  return (
    <Container className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
      <aside className="lg:col-span-4 lg:sticky top-26">
        <ProfileCard user={user} />
      </aside>

      <main className="lg:col-span-8 space-y-6">
        <Card className="border-muted/60 shadow-sm overflow-hidden">
          <CardHeader className="pb-4 border-b border-muted bg-muted/10">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Posts
            </CardTitle>
            <CardDescription>
              Check out what {user.firstName} has been sharing lately.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 sm:p-6 md:p-8">
            <PostList
              userId={user.id}
              sortBy="newest"
              emptyMessage={`${user.firstName} hasn't posted anything yet.`}
            />
          </CardContent>
        </Card>
      </main>
    </Container>
  );
}
