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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, isPending } = authClient.useSession();

  let navMain: any[] = [];

  if (session?.user?.role === "admin") {
    navMain = [
      { title: "Dashboard", url: "admin/dashboard", icon: IconDashboard },
      { title: "Courses", url: "admin/courses", icon: IconListDetails },
    ];
  } else if (session?.user?.role === "teacher") {
    navMain = [
      { title: "Dashboard", url: "teacher/dashboard", icon: IconDashboard },
      {
        title: "Enrolled Students",
        url: "/teacher/enrolled",
        icon: IconFileAi,
      },
    ];
  } else if (session?.user?.role === "user") {
    navMain = [
      { title: "Dashboard", url: "user/dashboard", icon: IconDashboard },
      { title: "My Courses", url: "user/courses", icon: IconListDetails },
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
