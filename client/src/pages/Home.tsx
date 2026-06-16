import PostList from "@/components/post/PostList";
import { Container } from "@/components/ui/container";
import { getPosts } from "@/services/postsService";

export default function Home() {
  return (
    <Container className="pt-6">
      <title>Feed / Birb</title>

      <PostList
        fetchAction={getPosts}
        emptyMessage="No posts to show on feed"
      />
    </Container>
  );
}
