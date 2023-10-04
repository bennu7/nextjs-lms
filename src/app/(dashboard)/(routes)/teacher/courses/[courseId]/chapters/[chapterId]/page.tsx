import React from "react";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import { type Metadata } from "next";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";

import { ChapterTitleForm } from "./_components/chapter-title-form";
import { ChapterDescriptionForm } from "./_components/chapter-desription-form";
import { ChapterAccessForm } from "./_components/chapter-access-form";
import { ChapterVideoForm } from "./_components/chapter-video-form";

export const metadata: Metadata = {
  title: "Course chapter setup",
  description: "Course chapter setup",
};

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();
  if (!userId) return redirect("/");

  const courseParamsSlug = params.courseId.replace(/-/g, " ");
  const chapterParamsSlug = params.chapterId.replace(/-/g, " ");

  const course = await db.course.findFirst({
    where: {
      title: courseParamsSlug,
      userId,
    },
  });

  if (!course)
    return (
      <div className="flex items-center justify-center w-full h-full text-2xl font-medium text-slate-700 mt-10">
        Course not found
      </div>
    );

  const chapter = await db.chapter.findFirst({
    where: {
      title: chapterParamsSlug,
      courseId: course.id,
    },
    include: {
      muxData: true,
    },
  });

  if (!chapter)
    return (
      <div className="flex items-center justify-center w-full h-full text-2xl font-medium text-slate-700 mt-10">
        Chapter course not found
      </div>
    );

  const requiredFields = [chapter.title, chapter.desc, chapter.videoUrl];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `${completedFields}/${totalFields}`;

  return (
    <div className="p-6 flex flex-col">
      <div className="flex items-center justify-between">
        <div className="w-full flex flex-col">
          <Link
            href={`/teacher/courses/${params.courseId}`}
            className="flex items-center text-sm hover:opacity-75 transition mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to course setup
          </Link>
          <div className="items-center justify-between flex w-full">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Chapter creation</h1>
              <span className="text-sm text-slate-700">
                Complete all fields {completionText}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your chapter</h2>
            </div>
            <ChapterTitleForm
              initialData={chapter}
              courseId={course.id}
              chapterId={chapter.id}
            />
            <ChapterDescriptionForm
              initialData={chapter}
              courseId={course.id}
              chapterId={chapter.id}
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Eye} />
              <h2 className="text-xl">Access Settings</h2>
            </div>
            <ChapterAccessForm
              courseId={course.id}
              initialData={chapter}
              chapterId={chapter.id}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-x-2">
            <IconBadge icon={Video} />
            <h2 className="text-xl">Add a video</h2>
          </div>
          <ChapterVideoForm
            courseId={course.id}
            initialData={chapter}
            chapterId={chapter.id}
          />
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
