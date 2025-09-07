"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useAssignRole } from "@/hooks/use-assign-role";
import { toast } from "sonner";

export default function DashboardRedirect() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // Handle pending role assignment
  useAssignRole();

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.push("/login");
      } else {
        // Check if email is verified
        if (!session.user.emailVerified) {
          toast.error(
            "Please verify your email address to access your dashboard."
          );
          router.push(`/verify-request?email=${session.user.email}`);
          return;
        }

        const role = session.user.role;
        if (role === "admin") router.push("/admin");
        else if (role === "teacher") router.push("/teacher");
        else if (role === "user") router.push("/user");
        else router.push("/dashboard");
      }
    }
  }, [session, isPending, router]);

  return null;
}
