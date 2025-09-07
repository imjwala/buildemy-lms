import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export const useAssignRole = () => {
  const { data: session } = authClient.useSession();

  useEffect(() => {
    const assignPendingRole = async () => {
      const pendingRole = localStorage.getItem("pendingRole");
      if (pendingRole && session?.user) {
        try {
          const response = await fetch("/api/auth/assign-role", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role: pendingRole }),
          });

          if (response.ok) {
            localStorage.removeItem("pendingRole");
            console.log("Role assigned successfully:", pendingRole);
            // Refresh the page to update the session
            window.location.reload();
          }
        } catch (error) {
          console.error("Failed to assign pending role:", error);
        }
      }
    };

    assignPendingRole();
  }, [session?.user]);
};
