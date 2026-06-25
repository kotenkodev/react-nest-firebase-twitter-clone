import DescriptionBlock from "@/components/DescriptionBlock";
import PhoneSignIn from "@/components/forms/PhoneSignInForm";
import SignInForm from "@/components/forms/SignInForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useDocumentTitle from "@/hooks/useDocumentTitle";

export default function SignIn() {
  useDocumentTitle("Sign In / Birb");

  return (
    <div className="relative min-h-screen w-full grid lg:grid-cols-[1fr_2fr] lg:px-0">
      <DescriptionBlock />

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Tabs defaultValue="email" className="w-full flex flex-col gap-4">
            <TabsList className="grid w-full! grid-cols-2">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="phone">Phone</TabsTrigger>
            </TabsList>
            <TabsContent value="email" className="w-full">
              <SignInForm />
            </TabsContent>
            <TabsContent value="phone" className="w-full">
              <PhoneSignIn />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
