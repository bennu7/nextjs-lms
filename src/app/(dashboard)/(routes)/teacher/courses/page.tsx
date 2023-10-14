import React from "react";
import { auth } from "@clerk/nextjs";
import { Course } from "@prisma/client";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const TeacherPage = async () => {
  type CourseWithSlugName = Course & { slugName: string };

  const { userId } = auth();

  if (!userId) return null;

  let dataCourses = (await db.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  })) as CourseWithSlugName[];

  const slugName = dataCourses.map((course) => {
    return course.title.split(" ").join("-").toLowerCase();
  });

  dataCourses = dataCourses.map((course, index) => {
    return {
      ...course,
      slugName: slugName[index],
    };
  }) as CourseWithSlugName[];

  return (
    <div className="p-6 ">
      <DataTable columns={columns} data={dataCourses} />
    </div>
  );
};

export default TeacherPage;
