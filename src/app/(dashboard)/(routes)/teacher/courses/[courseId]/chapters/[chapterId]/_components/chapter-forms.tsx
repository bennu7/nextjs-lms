"use client";

import React, { useState, useEffect } from "react";
import { Chapter, MuxData, Course } from "@prisma/client";
import { Eye, LayoutDashboard, Video } from "lucide-react";

import { useLanguageContext } from "@/context/language-context";
import { IconBadge } from "@/components/icon-badge";

import { ChapterTitleForm } from "./chapter-title-form";
import { ChapterDescriptionForm } from "./chapter-desription-form";
import { ChapterAccessForm } from "./chapter-access-form";
import { ChapterVideoForm } from "./chapter-video-form";

interface ChapterFormsProps {
  course: Course;
  chapter: Chapter & {
    muxData: MuxData | null;
  };
}
const ChapterForms: React.FC<ChapterFormsProps> = ({ chapter, course }) => {
  const [mount, setMount] = useState(false);
  const { language } = useLanguageContext();

  useEffect(() => {
    setMount(true);
  }, []);
  if (!mount) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">
              {language === "en"
                ? "Customize your chapter"
                : "Sesuaikan bab Anda"}
            </h2>
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
            <h2 className="text-xl">
              {language === "en" ? "Access Settings" : "Pengaturan Akses"}
            </h2>
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
          <h2 className="text-xl">
            {language === "en" ? "Add a video" : " Tambahkan video"}
          </h2>
        </div>
        <ChapterVideoForm
          courseId={course.id}
          initialData={chapter}
          chapterId={chapter.id}
        />
      </div>
    </div>
  );
};

export { ChapterForms };
