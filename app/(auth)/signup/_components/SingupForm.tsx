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
import { Loader, Loader2, Send, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FaGithub } from "react-icons/fa";
import { toast } from "sonner";

export const SignupForm = () => {
  const router = useRouter();

  const [githubPending, startGithubTransition] = useTransition();
  const [emailPending, startEmailTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "teacher">("user");

  async function signUpWithGithub() {
    startGithubTransition(async () => {
      try {
        // Store role before GitHub signup
        localStorage.setItem("pendingRole", role);

        // For GitHub, we need to use signIn.social
        await authClient.signIn.social({
          provider: "github",
          callbackURL: "/",
          fetchOptions: {
            onSuccess: () => {
              toast.success(
                "Account created with Github! You will be redirected..."
              );
            },
            onError: (error: any) => {
              console.error("GitHub signup error:", error);

              // Handle Better Auth error format for GitHub
              if (
                error?.code === "USER_ALREADY_EXISTS" ||
                error?.message?.includes("USER_ALREADY_EXISTS")
              ) {
                toast.error(
                  "Account already exists. Please try logging in instead."
                );
              } else if (
                error?.code === "GITHUB_ACCOUNT_LINKED" ||
                error?.message?.includes("GITHUB_ACCOUNT_LINKED")
              ) {
                toast.error(
                  "This GitHub account is already linked to another user."
                );
              } else if (error?.message) {
                toast.error(error.message);
              } else {
                toast.error(
                  "Failed to create account with GitHub. Please try again."
                );
              }
            },
          },
        });
      } catch (error: any) {
        console.error("GitHub signup error:", error);

        // Handle Better Auth error format for GitHub in catch block
        if (
          error?.code === "USER_ALREADY_EXISTS" ||
          error?.message?.includes("USER_ALREADY_EXISTS")
        ) {
          toast.error("Account already exists. Please try logging in instead.");
        } else if (
          error?.code === "GITHUB_ACCOUNT_LINKED" ||
          error?.message?.includes("GITHUB_ACCOUNT_LINKED")
        ) {
          toast.error("This GitHub account is already linked to another user.");
        } else if (error?.message) {
          toast.error(error.message);
        } else {
          toast.error(
            "Failed to create account with GitHub. Please try again."
          );
        }
      }
    });
  }

  function signUpWithEmail() {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!password.trim()) {
      toast.error("Please enter your password");
      return;
    }

    startEmailTransition(async () => {
      try {
        const result = await authClient.signUp.email({
          email: email,
          password: password,
          name: name,
          fetchOptions: {
            onSuccess: async () => {
              // Assign role after successful signup
              try {
                await fetch("/api/auth/assign-role", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ role: role }),
                });
              } catch (error) {
                console.error("Failed to assign role:", error);
                // Store role in localStorage as fallback
                localStorage.setItem("pendingRole", role);
              }

              toast.success(
                "Account created successfully! Sending verification email..."
              );
              signInWithEmailOtp();
            },
            onError: (error: any) => {
              console.error("Email signup error:", error);

              // Handle Better Auth error format
              if (
                error?.code === "USER_ALREADY_EXISTS" ||
                error?.message?.includes("USER_ALREADY_EXISTS") ||
                error?.message?.includes("User already exists") ||
                (error?.responseText &&
                  error.responseText.includes("USER_ALREADY_EXISTS")) ||
                (error?.responseText &&
                  error.responseText.includes("User already exists"))
              ) {
                toast.error("Email already exists.");
              } else if (
                error?.code === "INVALID_EMAIL" ||
                error?.message?.includes("INVALID_EMAIL")
              ) {
                toast.error("Please enter a valid email address.");
              } else if (
                error?.code === "WEAK_PASSWORD" ||
                error?.message?.includes("WEAK_PASSWORD")
              ) {
                toast.error(
                  "Password is too weak. Please choose a stronger password."
                );
              } else if (error?.message) {
                toast.error(error.message);
              } else {
                toast.error("Failed to create account. Please try again.");
              }
            },
          },
        });
      } catch (error: any) {
        console.error("Email signup error:", error);

        // Handle Better Auth error format in catch block
        if (
          error?.code === "USER_ALREADY_EXISTS" ||
          error?.message?.includes("USER_ALREADY_EXISTS") ||
          error?.message?.includes("User already exists") ||
          (error?.responseText &&
            error.responseText.includes("USER_ALREADY_EXISTS")) ||
          (error?.responseText &&
            error.responseText.includes("User already exists"))
        ) {
          toast.error("User already exists. Please try logging in instead.");
        } else if (
          error?.code === "INVALID_EMAIL" ||
          error?.message?.includes("INVALID_EMAIL")
        ) {
          toast.error("Please enter a valid email address.");
        } else if (
          error?.code === "WEAK_PASSWORD" ||
          error?.message?.includes("WEAK_PASSWORD")
        ) {
          toast.error(
            "Password is too weak. Please choose a stronger password."
          );
        } else if (error?.message) {
          toast.error(error.message);
        } else {
          toast.error("Failed to create account. Please try again.");
        }
      }
    });
  }

  function signInWithEmailOtp() {
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    startEmailTransition(async () => {
      try {
        // First check if user exists in database
        const userExists = await checkUserExists(email);

        if (!userExists) {
          toast.error(
            "No account found with this email address. Please sign up first or try a different email."
          );
          return;
        }

        // If user exists, proceed with sending OTP
        await authClient.emailOtp.sendVerificationOtp({
          email: email,
          type: "sign-in",
          fetchOptions: {
            onSuccess: () => {
              toast.success(
                "Verification email sent! Please check your inbox."
              );
              router.push(`/verify-request?email=${email}`);
            },
            onError: (error: any) => {
              // Extract the actual error from the nested structure
              const actualError =
                error?.error || error?.response?.error || error;

              // Handle Better Auth error format
              if (
                actualError?.code === "USER_NOT_FOUND" ||
                actualError?.message?.includes("USER_NOT_FOUND") ||
                actualError?.message?.includes("User not found")
              ) {
                toast.error(
                  "No account found with this email address. Please sign up first or try a different email."
                );
              } else if (
                actualError?.code === "INVALID_EMAIL" ||
                actualError?.message?.includes("INVALID_EMAIL")
              ) {
                toast.error("Please enter a valid email address.");
              } else if (actualError?.message) {
                toast.error(actualError.message);
              } else {
                toast.error(
                  "Unable to send verification email. Please try again or contact support if the issue persists."
                );
              }
            },
          },
        });
      } catch (error: any) {
        // Extract the actual error from the nested structure
        const actualError = error?.error || error?.response?.error || error;

        // Handle different types of errors
        if (error instanceof TypeError && error.message.includes("fetch")) {
          toast.error(
            "Network error. Please check your connection and try again."
          );
        } else if (
          error instanceof Error &&
          error.message.includes("Failed to fetch")
        ) {
          toast.error("Server is not responding. Please try again later.");
        } else if (
          actualError?.code === "USER_NOT_FOUND" ||
          actualError?.message?.includes("USER_NOT_FOUND") ||
          actualError?.message?.includes("User not found")
        ) {
          toast.error(
            "No account found with this email address. Please sign up first or try a different email."
          );
        } else if (actualError?.message) {
          toast.error(actualError.message);
        } else {
          toast.error(
            "Unable to send verification email. Please try again or contact support if the issue persists."
          );
        }
      }
    });
  }

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
              <Loader className="size-4 animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <FaGithub className="size-4 mr-2" />
              Sign up with Github
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
                <Loader2 className="size-4 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <UserPlus className="size-4" />
                <span>Create Account</span>
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
