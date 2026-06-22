import { Bird } from "lucide-react";
import TransitionLink from "./TransitionLink";

export default function DescriptionBlock() {
  return (
    <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
      <div className="absolute inset-0 bg-primary" />
      <TransitionLink
        to="/"
        className="relative z-20 flex items-center text-lg font-medium"
      >
        <Bird className="mr-2 h-6 w-6" />
        Birb
      </TransitionLink>
      <div className="relative z-20 mt-auto">
        <blockquote className="space-y-2">
          <p className="text-lg">
            &ldquo;This is a Twitter clone built with React, NestJS, and
            Firebase.&rdquo;
          </p>
        </blockquote>
      </div>
    </div>
  );
}
