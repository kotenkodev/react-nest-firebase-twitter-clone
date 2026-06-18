import PostList from "@/components/post/PostList";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [searchText, setSearchText] = useState("");

  return (
    <Container className="pt-6">
      <title>Feed / Birb</title>

      <div className="relative mb-4">
        <Input
          placeholder="Search posts..."
          className="mb-4"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <SearchIcon
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={16}
        />
      </div>

      <PostList
        search={searchText}
        sortBy="popular"
        emptyMessage="No posts to show on feed"
      />
    </Container>
  );
}
