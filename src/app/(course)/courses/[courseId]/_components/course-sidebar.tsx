"use client";

import React, { useState, useEffect } from "react";
import { Chapter, Course, UserProgress, Purchase } from "@prisma/client";
// import { auth } from "@clerk/nextjs";

// import { db } from "@/lib/db";
import { CourseSidebarItem } from "./course-sidebar-item";

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
  purchase: Purchase | null;
}
const CourseSidebar: React.FC<CourseSidebarProps> = ({
  course,
  progressCount,
  purchase,
}) => {
  const [mounted, setMounted] = useState(false);
  // const { userId } = auth();
  // if (!userId) return null;

  // const purchase = await db.purchase.findUnique({
  //   where: {
  //     userId_courseId: {
  //       userId,
  //       courseId: course.id,
  //     },
  //   },
  // });

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold">{course.title}</h1>
        {/* Check purchases and add progress */}
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            courseId={course.id}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            isLocked={!chapter.isFree && !purchase}
          />
        ))}
      </div>
    </div>
  );
};

export { CourseSidebar };
