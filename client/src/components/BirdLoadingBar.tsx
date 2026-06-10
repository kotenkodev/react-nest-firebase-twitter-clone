interface BirdLoadingAnimationProps {
  withBackground?: boolean;
}

export default function BirdLoadingAnimation({
  withBackground = false,
}: BirdLoadingAnimationProps) {
  return (
    <div
      id="bird-loader"
      className={`fixed inset-0 z-60 w-full h-screen pointer-events-none flex flex-col items-center justify-center ${
        withBackground ? "bg-neutral-950" : ""
      }`}
    >
      <div className="relative flex flex-col items-center">
        <img
          src="/favicon.svg"
          alt="Loading..."
          className="w-12 h-12 animate-bounce relative z-10 brightness-0 invert"
        />

        <div className="w-8 h-1.5 bg-white/20 rounded-full mt-1 animate-pulse" />
      </div>

      <p className="mt-6 text-sm text-white/70 font-medium animate-pulse tracking-wide">
        Loading...
      </p>
    </div>
  );
}
