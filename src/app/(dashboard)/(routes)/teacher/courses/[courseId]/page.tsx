import React from "react";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { LayoutDashboard } from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";

interface CourseIdPageProps {
  params: {
    courseId: string;
  };
}
const CourseIdPage: React.FC<CourseIdPageProps> = async ({ params }) => {
  const paramsSlug = params.courseId.replace(/-/g, " ");
  const { userId } = auth();

  if (!userId) return redirect("/");

  const course = await db.course.findFirst({
    where: {
      title: paramsSlug,
      userId,
    },
  });

  if (!course) return redirect("/");

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
  ];

  const totalFields = requiredFields.length; // menghitung jumlah field yang harus diisi
  const completedFields = requiredFields.filter(Boolean).length; // menghitung jumlah field yang telah diisi

  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course setup</h1>
          <span className="text-sm text-slate-700">
            Complete all fields {completionText}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 mt-16 md:grid-cols-2">
        <div className="">
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} size={"sm"} variant={"success"} />
            <h2 className="text-xl">Customize your course</h2>
          </div>
        </div>
      </div>
    </div>
  );
};
``;

export default CourseIdPage;
