"use client";

import React from "react";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

import { isTeacher } from "@/lib/teacher";
import { Button } from "@/components/ui/button";

import { SearchInput } from "./search-input";

const NavbarRoutes = () => {
  const pathname = usePathname();
  const { userId } = useAuth();

  if (!userId) return null;

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursesPage = pathname?.includes("/courses");
  // const isSearchPage = pathname?.startsWith("/search");
  const isSearchPage = pathname === "/search";

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex ml-auto gap-x-2">
        {isTeacherPage || isCoursesPage ? (
          <Link href={"/"}>
            <Button variant={"secondary"} size={"sm"}>
              <LogOut className="w-4 h-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : isTeacher(userId) ? (
          <Link href={"/teacher/courses"}>
            <Button size={"sm"} variant={"ghost"}>
              Teacher mode
            </Button>
          </Link>
        ) : null}
        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  );
};

export { NavbarRoutes };
