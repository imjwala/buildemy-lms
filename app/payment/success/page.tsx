import { prisma } from "@/lib/db"
import { requireUser } from "@/app/data/user/require-user"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, CheckIcon, XCircle } from "lucide-react"
import Link from "next/link"
import { stripe } from "@/lib/stripe"

export default async function PaymentSuccess({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams
  const sanitize = (raw?: string) => {
    if (!raw) return undefined
    const first = raw.split("?")[0].split("&")[0]
    try {
      return decodeURIComponent(first)
    } catch {
      return first
    }
  }

  let courseId = sanitize(params?.courseId)
  if (!courseId && params?.session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(params.session_id as string)
      courseId = session?.metadata?.courseId ?? undefined
    } catch {}
  }

  if (!courseId && params?.data) {
    try {
      const decoded = Buffer.from(params.data as string, "base64").toString("utf8")
      const parsed = JSON.parse(decoded)
      if (parsed?.courseId) courseId = parsed.courseId
    } catch {}
  }

  let ok = false
  let message = "We could not activate your enrollment. Make sure the link includes a valid courseId."

  if (courseId) {
    try {
      const user = await requireUser()
      const enrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: user.id, courseId } },
        select: { id: true, status: true },
      })

      if (!enrollment) {
        message = "Enrollment not found for this user and course. Did you initialize the enrollment before redirect?"
      } else {
        if (enrollment.status !== "Active") {
          await prisma.enrollment.update({
            where: { id: enrollment.id },
            data: { status: "Active", updatedAt: new Date() },
          })
          message = "Your enrollment is now active. Enjoy your course!"
        } else {
          message = "Your enrollment is already active."
        }
        ok = true
      }
    } catch (err) {
      message = "Authentication required or an internal error occurred while activating enrollment."
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-1 justify-center items-center">
      <Card className="w-[350px]">
        <CardContent>
          <div className="w-full flex justify-center">
            {ok ? (
              <CheckIcon className="size-12 p-2 bg-green-500/30 text-green-500 rounded-full" />
            ) : (
              <XCircle className="size-12 p-2 bg-red-500/30 text-red-500 rounded-full" />
            )}
          </div>
          <div className="mt-3 text-center sm:mt-5 w-full">
            <h2 className="text-xl font-semibold">{ok ? "Payment Successful" : "Something went wrong"}</h2>
            <p className="text-sm mt-2 text-muted-foreground tracking-tight text-balance">{message}</p>
            {!ok && (
              <p className="text-xs mt-2 text-muted-foreground">
                Troubleshooting: make sure your payment `success_url` includes <code>?courseId=&lt;courseId&gt;</code> or
                that Stripe provides a <code>session_id</code> (so server can read session metadata). For eSewa ensure you
                append <code>&courseId=&lt;courseId&gt;</code> (use <code>&</code> when adding to existing query params).
              </p>
            )}
            <Link href="/dashboard" className={buttonVariants({ className: "w-full mt-5" })}>
              <ArrowLeft className="size-4" />
              Go to Dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
