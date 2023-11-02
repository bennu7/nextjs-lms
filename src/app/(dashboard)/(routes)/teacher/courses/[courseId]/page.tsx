import React from "react";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { type Metadata } from "next";

import { db } from "@/lib/db";
import { Banner } from "@/components/banner";

import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/desription-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { CourseActions } from "./_components/course-actions";
import { CourseSetup } from "./_components/course-setup";
import { CustomizeCourse } from "./_components/customize-course";
import { CourseChapterPriceAttachmentsForm } from "./_components/course-chapter-price-attachment-form";

export const metadata: Metadata = {
  title: "Course setup",
  description: "Course setup",
};

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
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  // if (!course) return redirect("/");
  if (!course)
    return (
      <div className="flex items-center justify-center w-full h-full text-2xl font-medium text-slate-700 mt-10">
        Course not found
      </div>
    );

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished),
  ];

  const totalFields = requiredFields.length; // menghitung jumlah field yang harus diisi
  const completedFields = requiredFields.filter(Boolean).length; // menghitung jumlah field yang telah diisi

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!course.isPublished && (
        <Banner
          labelEn="This course is unpublished. It will not be visible to the student"
          labelId="Kursus ini belum dipublikasikan. Kursus tidak akan terlihat oleh siswa"
          variant={"warning"}
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <CourseSetup completionText={completionText} />
          <CourseActions
            disabled={!isComplete}
            courseId={course.id}
            isPublished={course.isPublished}
            slugCourse={params.courseId}
          />
        </div>
        <div className="grid grid-cols-1 gap-6 mt-16 md:grid-cols-2">
          <div className="flex flex-col">
            <CustomizeCourse />
            <TitleForm initialData={course} courseId={course.id} />
            <DescriptionForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categories.map((category) => {
                return {
                  value: category.id,
                  label: category.name,
                };
              })}
            />
          </div>
          <CourseChapterPriceAttachmentsForm course={course} />
        </div>
      </div>
    </>
  );
};
export default CourseIdPage;
