"use client";

import React, { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";

import { isTeacher } from "@/lib/teacher";
import { Button } from "@/components/ui/button";
import { useLanguageContext } from "@/context/language-context";
import { cn } from "@/lib/utils";

import { SearchInput } from "./search-input";

const indonesianIcon = "/icons/indonesian.png";
const unitedStatesIcon = "/icons/united-states.png";

const NavbarRoutes = () => {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { userId } = useAuth();

  if (!userId) return null;

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursesPage = pathname?.includes("/courses");
  // const isSearchPage = pathname?.startsWith("/search");
  const isSearchPage = pathname === "/search";
  const { language, setLanguageId, setLanguageEn } = useLanguageContext();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const manageLanguage = () => {
    if (language === "en") {
      setLanguageId();
    } else {
      setLanguageEn();
    }
  };

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex ml-auto gap-x-2 flex-row">
        <div
          className={cn(
            "relative aspect-video h-6 mt-2 hover:cursor-pointer hover:shadow-2xl"
          )}
          onClick={manageLanguage}
        >
          <Image
            className="object-cover"
            // src={language === "en" ? indonesianIcon : unitedStatesIcon}
            src={language === "en" ? indonesianIcon : unitedStatesIcon}
            alt="Languages"
            fill
          />
        </div>
        {isTeacherPage || isCoursesPage ? (
          <Link href={"/"}>
            <Button variant={"secondary"} size={"sm"}>
              <LogOut className="w-4 h-4 mr-2" />
              {language === "en" ? "   " + "exit" + "   " : "Keluar"}
            </Button>
          </Link>
        ) : isTeacher(userId) ? (
          <Link href={"/teacher/courses"}>
            <Button size={"sm"} variant={"ghost"}>
              {language === "en" ? "Teacher mode" : "Mode guru"}
            </Button>
          </Link>
        ) : null}
        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  );
};

export { NavbarRoutes };
