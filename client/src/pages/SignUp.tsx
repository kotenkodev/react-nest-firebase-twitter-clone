import DescriptionBlock from "@/components/DescriptionBlock";
import SignUpForm from "@/components/forms/SignUpForm";
import useDocumentTitle from "@/hooks/useDocumentTitle";

export default function SignUp() {
  useDocumentTitle("Sign Up / Birb");

  return (
    <div className="relative min-h-screen w-full grid lg:grid-cols-[2fr_1fr] lg:px-0">
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <SignUpForm />
        </div>
      </div>
      <DescriptionBlock />
    </div>
  );
}
