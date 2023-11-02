"use client";

import React, { useState, useEffect } from "react";
import { CircleDollarSign, ListChecks, File } from "lucide-react";
import { Course, Chapter, Attachment } from "@prisma/client";

import { IconBadge } from "@/components/icon-badge";
import { useLanguageContext } from "@/context/language-context";

import { ChaptersForm } from "./chapters-form";
import { PriceForm } from "./price-form";
import { AttachmentForm } from "./attachment-form";

interface CourseChapterPriceAttachmentsFormProps {
  course: Course & { chapters: Chapter[] } & {
    attachments: Attachment[];
  };
}
const CourseChapterPriceAttachmentsForm: React.FC<
  CourseChapterPriceAttachmentsFormProps
> = ({ course }) => {
  const [mount, setMount] = useState(false);
  const { language } = useLanguageContext();

  useEffect(() => {
    setMount(true);
  }, []);
  if (!mount) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <div className="flex items-center gap-x-2">
          <IconBadge icon={ListChecks} />
          <h2 className="text-xl">
            {language === "en" ? "Course Chapters" : "Bab Kursus"}
          </h2>
        </div>
        <ChaptersForm initialData={course} courseId={course.id} />
      </div>
      <div>
        <div className="flex items-center gap-x-2">
          <IconBadge icon={CircleDollarSign} />
          <h2 className="text-xl">
            {language === "en" ? "Sell your course" : "Jual kursus anda"}
          </h2>
        </div>
        <PriceForm initialData={course} courseId={course.id} />
      </div>
      <div className="">
        <div className="flex items-center gap-x-2">
          <IconBadge icon={File} />
          <h2 className="text-xl">
            {language === "en"
              ? "Resources & Attachments"
              : "Sumber & Lampiran"}
          </h2>
        </div>
        <AttachmentForm initialData={course} courseId={course.id} />
      </div>
    </div>
  );
};

export { CourseChapterPriceAttachmentsForm };
