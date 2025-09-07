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
import { authClient } from "@/lib/auth-client";
import { Loader, Loader2, Send, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FaGithub } from "react-icons/fa";
import { toast } from "sonner";
import { checkUserExists } from "@/lib/actions/check-user-exists";

export const LoginForm = () => {
  const router = useRouter();

  const [githubPending, startGithubTransition] = useTransition();
  const [emailPending, startEmailTransition] = useTransition();
  const [passwordPending, startPasswordTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signInWithGithub() {
    startGithubTransition(async () => {
      try {
        await authClient.signIn.social({
          provider: "github",
          callbackURL: "/",
          fetchOptions: {
            onSuccess: () => {
              toast.success("Signed in with Github, you will be redirected...");
            },
            onError: (error: any) => {
              console.error("GitHub login error:", error);

              // Handle Better Auth error format for GitHub
              if (
                error?.code === "USER_NOT_FOUND" ||
                error?.message?.includes("USER_NOT_FOUND")
              ) {
                toast.error(
                  "No account found with this GitHub account. Please sign up first."
                );
              } else if (error?.message) {
                toast.error(error.message);
              } else {
                toast.error("Failed to sign in with GitHub. Please try again.");
              }
            },
          },
        });
      } catch (error: any) {
        console.error("GitHub login error:", error);

        // Handle Better Auth error format for GitHub in catch block
        if (
          error?.code === "USER_NOT_FOUND" ||
          error?.message?.includes("USER_NOT_FOUND")
        ) {
          toast.error(
            "No account found with this GitHub account. Please sign up first."
          );
        } else if (error?.message) {
          toast.error(error.message);
        } else {
          toast.error("Failed to sign in with GitHub. Please try again.");
        }
      }
    });
  }

  function signInWithEmailPassword() {
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!password.trim()) {
      toast.error("Please enter your password");
      return;
    }

    startPasswordTransition(async () => {
      try {
        const result = await authClient.signIn.email({
          email: email,
          password: password,
          fetchOptions: {
            onSuccess: () => {
              toast.success(
                "Signed in successfully! You will be redirected..."
              );
              router.push("/");
            },
            onError: (error: any) => {
              // Extract the actual error from the nested structure
              const actualError =
                error?.error || error?.response?.error || error;

              // Handle specific error cases gracefully
              if (
                actualError?.code === "EMAIL_NOT_VERIFIED" ||
                actualError?.message?.includes("EMAIL_NOT_VERIFIED") ||
                actualError?.message?.includes("Email not verified")
              ) {
                toast.success("Please verify your email to continue.");
                router.push(`/verify-request?email=${email}`);
              } else if (
                actualError?.code === "INVALID_CREDENTIALS" ||
                actualError?.code === "INVALID_EMAIL_OR_PASSWORD" ||
                actualError?.message?.includes("INVALID_CREDENTIALS") ||
                actualError?.message?.includes("Invalid email or password") ||
                actualError?.message?.includes(
                  "Password verification failed"
                ) ||
                actualError?.message?.includes("Credential account not found")
              ) {
                // Check if this might be a user who registered with a different method
                if (
                  actualError?.message?.includes(
                    "Credential account not found"
                  ) ||
                  actualError?.message?.includes("no password") ||
                  actualError?.message?.includes(
                    "Password verification failed"
                  ) ||
                  actualError?.code === "INVALID_CREDENTIALS"
                ) {
                  toast.error(
                    "This email is associated with a social account or was registered using email verification. Please use the appropriate sign-in method above."
                  );
                } else {
                  toast.error(
                    "Invalid email or password. Please check your credentials and try again."
                  );
                }
              } else if (
                actualError?.code === "USER_NOT_FOUND" ||
                actualError?.message?.includes("USER_NOT_FOUND")
              ) {
                toast.error(
                  "No account found with this email address. Please sign up first or verify your email address."
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
                  "Unable to sign in. Please try again or use an alternative sign-in method."
                );
              }
            },
          },
        });
      } catch (error: any) {
        // Extract the actual error from the nested structure
        const actualError = error?.error || error?.response?.error || error;

        // Handle different types of errors gracefully
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
          actualError?.code === "EMAIL_NOT_VERIFIED" ||
          actualError?.message?.includes("EMAIL_NOT_VERIFIED") ||
          actualError?.message?.includes("Email not verified")
        ) {
          toast.success("Please verify your email to continue.");
          router.push(`/verify-request?email=${email}`);
        } else if (
          actualError?.code === "INVALID_CREDENTIALS" ||
          actualError?.code === "INVALID_EMAIL_OR_PASSWORD" ||
          actualError?.message?.includes("INVALID_CREDENTIALS") ||
          actualError?.message?.includes("Invalid email or password") ||
          actualError?.message?.includes("Password verification failed") ||
          actualError?.message?.includes("Credential account not found")
        ) {
          // Check if this might be a user who registered with a different method
          if (
            actualError?.message?.includes("Credential account not found") ||
            actualError?.message?.includes("no password") ||
            actualError?.message?.includes("Password verification failed") ||
            actualError?.code === "INVALID_CREDENTIALS"
          ) {
            toast.error(
              "This email is associated with a social account or was registered using email verification. Please use the appropriate sign-in method above."
            );
          } else {
            toast.error(
              "Invalid email or password. Please check your credentials and try again."
            );
          }
        } else if (
          actualError?.code === "USER_NOT_FOUND" ||
          actualError?.message?.includes("USER_NOT_FOUND")
        ) {
          toast.error(
            "No account found with this email address. Please sign up first or verify your email address."
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
            "Unable to sign in. Please try again or use an alternative sign-in method."
          );
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
        <CardTitle className="text-xl">Welcome back!</CardTitle>
        <CardDescription>
          Login with your Github or email account
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <Button
          disabled={githubPending}
          className="w-full"
          variant="outline"
          onClick={signInWithGithub}
        >
          {githubPending ? (
            <>
              <Loader className="size-4 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <>
              <FaGithub className="size-4 mr-2" />
              Sign in with Github
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
              placeholder="Enter your password"
              required
            />
          </div>

          <Button onClick={signInWithEmailPassword} disabled={passwordPending}>
            {passwordPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <LogIn className="size-4" />
                <span>Sign In</span>
              </>
            )}
          </Button>

          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-card px-2 text-muted-foreground">
              Or
            </span>
          </div>

          <Button
            onClick={signInWithEmailOtp}
            disabled={emailPending}
            variant="outline"
          >
            {emailPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="size-4" />
                <span>Continue with Email Link</span>
              </>
            )}
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Button
            variant="link"
            className="p-0 h-auto font-normal"
            onClick={() => router.push("/signup")}
          >
            Sign up
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
