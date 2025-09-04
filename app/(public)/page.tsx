"use client";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

interface FeatureProps {
  title: string;
  description: string;
  icon: string;
}

const features: FeatureProps[] = [
  {
    title: "Comprehensive Courses",
    description:
      "Access a wide range of carefully courses designed by industry experts.",
    icon: "📚",
  },
  {
    title: "Interactive Learning",
    description:
      "Engage with interactive content, quizzes, and assessments to enhance your learning experience.",
    icon: "🎮",
  },
  {
    title: "Progress Tracking",
    description:
      "Monitor your progress and achievements with detailed analytics and personalized dashboards.",
    icon: "📊",
  },
  {
    title: "Community Support",
    description:
      "Connect with fellow learners, instructors, and industry experts for peer-to-peer support and collaboration.",
    icon: "👥",
  },
];

export default function Home() {
  const { data: session, isPending } = authClient.useSession();
  const isLoggedIn = !!session;

  return (
    <>
      <section className="relative py-20">
        <div className="flex flex-col items-center justify-center space-y-8">
          <Badge variant="outline">
            Buildemy - The Future of Online Education
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-center">
            Elevate your <span className="text-primary">Learning</span> Experience
          </h1>
          <p className="max-w-[700px] text-muted-foreground text-center md:text-xl">
            Discover a new way to learn with our modern, interactive learning
            management system. Access high-quality courses anytime, anywhere.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
           
            <Link href="/courses" className={buttonVariants({ size: "lg" })}>
              Explore Courses
            </Link>

            {/* Sign In only if not logged in */}
            {!isPending && !isLoggedIn && (
              <Link
                href="/login"
                className={buttonVariants({ size: "lg", variant: "outline" })}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </section>

 <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-24">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="rounded-3xl border border-border/60 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <CardHeader className="space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl">
                {feature.icon}
              </div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>

            <CardContent className="mt-0">
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}