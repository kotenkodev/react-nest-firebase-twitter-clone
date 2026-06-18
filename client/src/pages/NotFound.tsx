import { BirdSpinner } from "@/components/ui/bird-spinner";
import { Container } from "@/components/ui/container";
import TransitionLink from "@/components/TransitionLink";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-12 animate-in fade-in zoom-in duration-500">
      <title>Birb - Page Not Found</title>

      <div className="flex flex-col items-center">
        <h1 className="text-[10rem] leading-none font-black text-muted-foreground/10 select-none">
          404
        </h1>
        <BirdSpinner size={80} label="" className="-mt-20 relative z-10" />
      </div>

      <div className="space-y-3">
        <h2 className="text-3xl font-bold tracking-tight">
          Oops! Page not found
        </h2>
        <p className="text-muted-foreground text-lg max-w-100 mx-auto">
          The post or profile you're looking for might have flown away or never
          existed in the first place.
        </p>
      </div>

      <TransitionLink to="/">
        <Button size="lg" className="px-10 font-bold">
          Fly back home
        </Button>
      </TransitionLink>
    </Container>
  );
}
