import { Container } from "@/components/ui/container";
import PostList from "@/components/post/PostList";
import SearchBar from "@/components/SearchBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home as HomeIcon, Compass as CompassIcon } from "lucide-react";

export default function Home() {
  return (
    <Container className="p-0 sm:px-6 lg:px-8">
      <Tabs defaultValue="home" className="w-full max-w-2xl mx-auto">
        <TabsList
          variant="line"
          className="w-full border-b border-border flex rounded-none p-0 h-12 gap-0 sticky top-[71.5px] z-20 bg-white"
        >
          <TabsTrigger
            value="home"
            className="flex-1 text-center font-semibold text-base h-full rounded-none transition-all cursor-pointer relative gap-2 data-[state=active]:text-foreground data-[state=active]:font-bold after:hidden"
          >
            <HomeIcon className="w-4 h-4" />
            <span>Home</span>
          </TabsTrigger>
          <TabsTrigger
            value="explore"
            className="flex-1 text-center font-semibold text-base h-full rounded-none transition-all cursor-pointer relative gap-2 data-[state=active]:text-foreground data-[state=active]:font-bold after:hidden"
          >
            <CompassIcon className="w-4 h-4" />
            <span>Explore</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="home" className="mt-6 focus-visible:outline-none">
          <PostList sortBy="popular" />
        </TabsContent>

        <TabsContent
          value="explore"
          className="mt-6 focus-visible:outline-none space-y-6"
        >
          <SearchBar />
        </TabsContent>
      </Tabs>
    </Container>
  );
}
