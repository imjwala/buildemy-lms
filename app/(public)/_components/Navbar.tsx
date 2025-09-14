"use client";

import Link from "next/link";
import Logo from "@/public/logo.png";
import Image from "next/image";
import { ThemeToggle } from "@/components/themeToggle";
import { authClient } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";
import { UserDropdown } from "./UserDropdown";

// Navigation item type
interface NavigationItem {
  name: string;
  href: string;
}

// Base navigation items for all users
const baseNavigationItems: NavigationItem[] = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Courses",
    href: "/courses",
  },
];

// Role-specific navigation items
const getRoleBasedNavigation = (role: string | undefined): NavigationItem[] => {
  switch (role) {
    case "admin":
      return [
        ...baseNavigationItems,
        {
          name: "Admin Dashboard",
          href: "/admin",
        },
      ];
    case "teacher":
      return [
        ...baseNavigationItems,
        {
          name: "Teacher Dashboard",
          href: "/teacher",
        },
      ];
    case "user":
      return [
        ...baseNavigationItems,
        {
          name: "My Dashboard",
          href: "/user",
        },
      ];
    default:
      return [
        ...baseNavigationItems,
        {
          name: "Dashboard",
          href: "/dashboard",
        },
      ];
  }
};

export const Navbar = () => {
  const { data: session, isPending } = authClient.useSession();

  // Get navigation items based on user role
  const roleBasedNavigation = getRoleBasedNavigation(
    session?.user?.role ?? undefined
  );

  return (
    <header className="sticky top-0 z-50 w-full border bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60">
      <div className="container flex min-h-16 items-center mx-auto px-4 md:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2 mr-4">
          <Image src={Logo} alt="Logo" className="size-9" />
          <span className="font-bold">Buildemy.</span>
        </Link>

        {/* desktop navigation*/}
        <nav className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <div className="flex items-center space-x-2">
            {roleBasedNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {isPending ? null : session ? (
              <UserDropdown
                email={session.user.email}
                image={
                  session?.user.image ??
                  `https://avatar.vercel.sh/rauchg/${session?.user.email}`
                }
                name={
                  session?.user.name && session?.user.name.length > 0
                    ? session?.user.name
                    : session?.user.email.split("@")[0]
                }
                role={session?.user?.role ?? undefined}
              />
            ) : (
              <>
                <Link
                  href="/login"
                  className={buttonVariants({ variant: "secondary" })}
                >
                  Login
                </Link>
                <Link href="/signup" className={buttonVariants()}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
