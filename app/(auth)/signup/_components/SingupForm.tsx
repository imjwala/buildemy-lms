"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";
import { checkUserExists } from "@/lib/actions/check-user-exists";
import { Loader, Loader2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { FaGithub } from "react-icons/fa";
import { toast } from "sonner";

// Component to assign GitHub role after redirect
export const AssignGithubRole = ({ email }: { email: string }) => {
  useEffect(() => {
    const pendingRole = localStorage.getItem("pendingRole");
    if (pendingRole && email) {
      fetch("/api/auth/assign-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: pendingRole }),
      })
        .then(() => localStorage.removeItem("pendingRole"))
        .catch(console.error);
    }
  }, [email]);

  return null;
};

export const SignupForm = () => {
  const router = useRouter();

  const [githubPending, startGithubTransition] = useTransition();
  const [emailPending, startEmailTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "teacher">("user");

  // Email Signup

  function signUpWithEmail() {
    if (!name.trim()) return toast.error("Please enter your name");
    if (!email.trim()) return toast.error("Please enter your email");
    if (!password.trim()) return toast.error("Please enter your password");

    startEmailTransition(async (): Promise<void> => {
      try {
        await authClient.signUp.email({
          email,
          password,
          name,
          fetchOptions: {
            onSuccess: async (): Promise<void> => {
              // Assign role after signup
              try {
                await fetch("/api/auth/assign-role", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email, role }),
                });
              } catch (error) {
                console.error("Failed to assign role:", error);
                localStorage.setItem("pendingRole", role);
              }

              toast.success(
                "Account created successfully! Sending verification email..."
              );
              signInWithEmailOtp();
            },
            onError: (error: any) => {
              console.error("Email signup error:", error);
              toast.error(error?.message || "Failed to create account.");
            },
          },
        });
      } catch (error: any) {
        console.error("Email signup error:", error);
        toast.error(error?.message || "Failed to create account.");
      }
    });
  }

  // GitHub Signup

  async function signUpWithGithub() {
    startGithubTransition(async (): Promise<void> => {
      try {
        localStorage.setItem("pendingRole", role);

        await authClient.signIn.social({
          provider: "github",
          callbackURL: "/",
        });
      } catch (error: any) {
        console.error("GitHub signup error:", error);
        toast.error(error?.message || "Failed to create account with GitHub.");
      }
    });
  }

 
  // Email OTP Sign-in
 
  function signInWithEmailOtp() {
    if (!email.trim()) return toast.error("Please enter your email");

    startEmailTransition(async (): Promise<void> => {
      try {
        const userExists = await checkUserExists(email);
        if (!userExists) {
          toast.error(
            "No account found with this email. Please sign up first."
          );
          return;
        }

        await authClient.emailOtp.sendVerificationOtp({
          email,
          type: "sign-in",
          fetchOptions: {
            onSuccess: (): void => {
              toast.success("Verification email sent! Check your inbox.");
              router.push(`/verify-request?email=${email}`);
            },
            onError: (error: any) => {
              console.error(error);
              toast.error(error?.message || "Failed to send verification email.");
            },
          },
        });
      } catch (error: any) {
        console.error(error);
        toast.error(error?.message || "Failed to send verification email.");
      }
    });
  }

 
  // JSX
 
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Create your account</CardTitle>
        <CardDescription>
          Sign up with your Github or email account
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* Role Selector */}
        <div className="grid gap-2">
          <Label htmlFor="role">I want to sign up as:</Label>
          <Select
            value={role}
            onValueChange={(value: "user" | "teacher") => setRole(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">Student - Learn from courses</SelectItem>
              <SelectItem value="teacher">
                Teacher - Create and teach courses
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          disabled={githubPending}
          className="w-full"
          variant="outline"
          onClick={signUpWithGithub}
        >
          {githubPending ? (
            <>
              <Loader className="size-4 animate-spin" /> Creating account...
            </>
          ) : (
            <>
              <FaGithub className="size-4 mr-2" /> Sign up with Github
            </>
          )}
        </Button>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>

        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              minLength={6}
            />
          </div>

          <Button onClick={signUpWithEmail} disabled={emailPending}>
            {emailPending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Creating account...
              </>
            ) : (
              <>
                <UserPlus className="size-4" /> <span>Create Account</span>
              </>
            )}
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button
            variant="link"
            className="p-0 h-auto font-normal"
            onClick={() => router.push("/login")}
          >
            Sign in
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignupForm;
