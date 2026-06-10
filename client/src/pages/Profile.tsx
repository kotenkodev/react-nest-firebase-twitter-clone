import TransitionLink from "@/components/TransitionLink";

export default function Profile() {
  return (
    <div>
      <title>Profile</title>
      Profile
      <button>
        <TransitionLink
          to="/"
          label="Go to Profile"
          className="text-blue-500"
        />
      </button>
    </div>
  );
}
