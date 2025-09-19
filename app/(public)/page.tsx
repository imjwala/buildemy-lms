import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface FeatureProps {
  title: string;
  description: string;
  icon: string;
}

const features: FeatureProps[] = [
  {
    title: "Comprehensive Courses",
    description:
      "Access a wide range of carefully courses designed by indrustry experts.",
    icon: "📚",
  },
  {
    title: "Local Payment Support",
    description:
      "Support smooth transactions with Nepalese payment gateways (Esewa).",
    icon: "💰",
  },
  {
    title: "Progress Tracking",
    description:
      "Monitor your progress and achievements with detailed analytics and personalized dashboards.",
    icon: "📊",
  },
  {
    title: "Security",
    description:
      "Offers robust authentication mechanisms to ensure only authorized users can access the platform.",
    icon: "🔒",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative py-20">
        <div className="flex flex-col items-center justify-center space-y-8">
          <Badge variant="outline">
            Buildemy-The Future of Online Education
          </Badge>
          <h1
  className="w-full text-center whitespace-nowrap text-xl sm:text-3xl md:text-5xl font-bold tracking-tight"
>
  Elevate your <span className="text-blue-600">Learning</span> Experience
</h1>

          <p className="max-w-[700px] text-muted-foreground text-center md:text-xl">
            Discover a new way to learn with our modern, interactive learning
            management system. Access high-quality courses anytime, anywhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link href="/courses" className={buttonVariants({ size: "lg" })}>
              Explore Courses
            </Link>
            {/* <Link
              href="/login"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Sign In
            </Link> */}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-4">{feature.icon}</div>
              <CardTitle>{feature.title}</CardTitle>
              <CardContent className="px-1">
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </section>
    </>
  );
}
