import DescriptionBlock from "@/components/DescriptionBlock";
import SignUpForm from "@/components/forms/SignUpForm";

export default function SignUp() {
  return (
    <div className="relative min-h-screen w-full grid lg:grid-cols-[2fr_1fr] lg:px-0">
      <title>Sign Up / Birb</title>
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <SignUpForm />
        </div>
      </div>
      <DescriptionBlock />
    </div>
  );
}
