import { auth } from "@/lib/auth";
import { SignupForm } from "./_components/SingupForm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const SignupPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    return redirect("/");
  }

  return <SignupForm />;
};

export default SignupPage;
