"use client";

import React, { useState, useEffect } from "react";
import { Course, Chapter, UserProgress, Purchase } from "@prisma/client";
import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CourseSidebar } from "./course-sidebar";

interface CourseMobileSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
  purchase: Purchase | null;
}
const CourseMobileSidebar: React.FC<CourseMobileSidebarProps> = ({
  course,
  progressCount,
  purchase,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu className="w-6 h-6" />
      </SheetTrigger>
      <SheetContent className="p-0 bg-white w-72" side={"left"}>
        <CourseSidebar
          purchase={purchase}
          course={course}
          progressCount={progressCount}
        />
      </SheetContent>
    </Sheet>
  );
};

export { CourseMobileSidebar };
