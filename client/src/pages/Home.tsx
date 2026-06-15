import TransitionLink from "@/components/TransitionLink";

export default function Home() {
  return (
    <div>
      <title>Feed / Birb</title>
      Home
      <button>
        <TransitionLink to="/profile" className="text-blue-500">
          Go to Profile
        </TransitionLink>
      </button>
    </div>
  );
}
