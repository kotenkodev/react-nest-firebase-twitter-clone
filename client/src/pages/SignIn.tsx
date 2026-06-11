import DescriptionBlock from "@/components/DescriptionBlock";
import SignInForm from "@/components/forms/SignInForm";

export default function SignIn() {
  return (
    <div className="relative min-h-screen w-full grid lg:grid-cols-[1fr_2fr] lg:px-0">
      <title>Sign In / Birb</title>
      <DescriptionBlock />

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <SignInForm />
        </div>
      </div>
    </div>
  );
}
