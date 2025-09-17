"use client"; 

import { Suspense, useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2 } from "lucide-react";


const VerifyRequestContent = () => {
  const router = useRouter();
  const params = useSearchParams(); // This hook is now inside a client-side component

  const [otp, setOtp] = useState("");
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");

  const isOtpCompleted = otp.length === 6;

  // Get email safely from search params on client
  useEffect(() => {
    const emailParam = params.get("email");
    if (emailParam) setEmail(emailParam);
  }, [params]);

  const verifyOtp = () => {
    if (!email) return;

    startTransition(async () => {
      try {
        await authClient.signIn.emailOtp({
          email,
          otp,
          fetchOptions: {
            onSuccess: () => {
              toast.success("Email Verified! Redirecting to dashboard...");
              router.push("/");
            },
            onError: () => {
              toast.error("Failed to verify OTP. Please try again.");
            },
          },
        });
      } catch (err) {
        toast.error("Something went wrong.");
      }
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Verify Your Email</CardTitle>
        <CardDescription>
          Enter the 6-digit code we sent to your email address.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(val) => setOtp(val)}
            className="gap-2"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <p className="text-sm text-muted-foreground">
            Enter the code sent to {email || "your email"}
          </p>
        </div>

        <Button
          className="w-full"
          onClick={verifyOtp}
          disabled={isPending || !isOtpCompleted}
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </span>
          ) : (
            "Verify Account"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

// This is the default export of your page, which includes the Suspense boundary
const VerifyRequestPage = () => {
  return (
    <Suspense fallback={<div>Loading verification page...</div>}>
      <VerifyRequestContent />
    </Suspense>
  );
};

export default VerifyRequestPage;


export const dynamic = "force-dynamic";