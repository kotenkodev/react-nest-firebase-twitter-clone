import { BirdSpinner } from "./ui/bird-spinner";

interface LoadingAnimationProps {
  withBackground?: boolean;
}

export default function LoadingAnimation({
  withBackground = false,
}: LoadingAnimationProps) {
  return (
    <div
      id="bird-loader"
      className={`fixed inset-0 z-100 w-full h-screen pointer-events-none flex flex-col items-center justify-center ${
        withBackground ? "bg-neutral-950" : ""
      }`}
    >
      <BirdSpinner
        size={48}
        iconClassName="brightness-0 invert"
        className="text-white"
      />
    </div>
  );
}
