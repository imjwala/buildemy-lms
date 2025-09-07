"use client";

import * as React from "react";
import {
  IconCamera,
  IconDashboard,
  IconFileAi,
  IconFileDescription,
  IconHelp,
  IconListDetails,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/logo.png";
import { authClient } from "@/lib/auth-client";
import { UserSquare } from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, isPending } = authClient.useSession();

  let navMain: any[] = [];

  if (session?.user?.role === "admin") {
    navMain = [
      { title: "Dashboard", url: "/admin", icon: IconDashboard },
      { title: "Courses", url: "/admin/courses", icon: IconListDetails },
      { title: "Users", url: "/admin/users", icon: IconUsers },
      { title: "Teachers", url: "/admin/teachers", icon: UserSquare },
      { title: "Settings", url: "/admin/settings", icon: IconSettings },
    ];
  } else if (session?.user?.role === "teacher") {
    navMain = [
      { title: "Dashboard", url: "/teacher", icon: IconDashboard },
      { title: "My Courses", url: "/teacher/courses", icon: IconListDetails },
      {
        title: "Add Course",
        url: "/teacher/courses/create",
        icon: IconFileDescription,
      },

      {
        title: "Settings",
        url: "/teacher/settings",
        icon: IconSettings,
      },
    ];
  } else if (session?.user?.role === "user") {
    navMain = [
      { title: "Dashboard", url: "/user", icon: IconDashboard },
      { title: "My Courses", url: "/user/courses", icon: IconListDetails },
      { title: "Settings", url: "/user/settings", icon: IconSettings },
    ];
  } else {
    navMain = [{ title: "Dashboard", url: "/dashboard", icon: IconDashboard }];
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <Image src={Logo} alt="Logo" className="size-5" />
                <span className="text-base font-semibold">Buildemy.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {!isPending && <NavMain items={navMain} />}
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
