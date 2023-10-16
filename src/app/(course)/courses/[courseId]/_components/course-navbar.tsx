"use client";

import React from "react";
import { Course, Chapter, UserProgress, Purchase } from "@prisma/client";

import { NavbarRoutes } from "@/components/navbar-routes";
import { CourseMobileSidebar } from "./course-mobile-sidebar";

interface CourseNavbarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
  purchase: Purchase | null;
}
const CourseNavbar: React.FC<CourseNavbarProps> = ({
  course,
  progressCount,
  purchase,
}) => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <CourseMobileSidebar
        purchase={purchase}
        course={course}
        progressCount={progressCount}
      />
      <NavbarRoutes />
    </div>
  );
};

export { CourseNavbar };
