"use client";

import React, { useEffect, useState } from "react";
import { BarChart, Compass, Layout, List, LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { useLanguageContext } from "@/context/language-context";
import { SidebarItem } from "./sidebar-item";

interface ISidebarRoute {
  icon: LucideIcon;
  label: string;
  href: string;
}

const guestRoutes: ISidebarRoute[] = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/search",
  },
];

const guestRoutesID: ISidebarRoute[] = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Compass,
    label: "Jelajah",
    href: "/search",
  },
];

const teacherRoutes: ISidebarRoute[] = [
  {
    icon: List,
    label: "Courses",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/teacher/analytics",
  },
];

const teacherRoutesID: ISidebarRoute[] = [
  {
    icon: List,
    label: "Kursus",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analitik",
    href: "/teacher/analytics",
  },
];

const SidebarRoutes = () => {
  const [mounted, setMounted] = useState(false);
  const pathName = usePathname();
  const { language } = useLanguageContext();

  const isTeacherPage = pathName?.includes("/teacher");

  const routes = isTeacherPage
    ? language === "en"
      ? teacherRoutes
      : teacherRoutesID
    : language === "en"
    ? guestRoutes
    : guestRoutesID;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};

export { SidebarRoutes };
