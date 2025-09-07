"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useTransition, useState } from "react";
import { tryCatch } from "@/hooks/try-catch";
import { enrollInCourseAction } from "../actions";
import { Loader2 } from "lucide-react";

export const EnrollmentButton = ({
  courseId,
  disabled = false,
  disabledMessage = "Please sign in to enroll",
}: {
  courseId: string;
  disabled?: boolean;
  disabledMessage?: string;
}) => {
  const [isPending, startTransition] = useTransition();
  const [paymentMethod, setPaymentMethod] = useState<"esewa" | "stripe">("esewa");

  const onSubmit = () => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        enrollInCourseAction(courseId, paymentMethod)
      );

      if (error) {
        toast.error("An unexpected error occurred");
        return;
      }

      if (result.status === "success" && result.html) {
        const container = document.createElement("div");
        container.innerHTML = result.html;
        document.body.appendChild(container);
        const form = document.getElementById("esewa-payment-form") as HTMLFormElement;
        form?.submit();
      } else if (result.status === "error") {
        toast.error(result.message);
      } else if ((result as any).checkoutUrl) {
        window.location.href = (result as any).checkoutUrl;
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "esewa" | "stripe")}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Payment Method" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="esewa">Esewa</SelectItem>
          <SelectItem value="stripe">Stripe</SelectItem>
        </SelectContent>
      </Select>

      <Button
        className="w-full"
        onClick={onSubmit}
        disabled={isPending || disabled}
        title={disabled ? disabledMessage : undefined}
      >
        {isPending ? (
          <>
            <Loader2 className="animate-spin size-4" />
            Loading...
          </>
        ) : disabled ? (
          disabledMessage
        ) : (
          "Enroll Now!"
        )}
      </Button>
    </div>
  );
};
