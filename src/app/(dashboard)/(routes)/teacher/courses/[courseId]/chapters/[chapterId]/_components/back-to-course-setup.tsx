"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { useLanguageContext } from "@/context/language-context";

interface BackToCourseSetupProps {
  params: {
    courseId: string;
    chapterId: string;
  };
}
const BackToCourseSetup: React.FC<BackToCourseSetupProps> = ({ params }) => {
  const [mount, setMount] = useState(false);
  const { language } = useLanguageContext();

  useEffect(() => {
    setMount(true);
  }, []);
  if (!mount) return null;

  return (
    <div>
      <Link
        href={`/teacher/courses/${params.courseId}`}
        className="flex items-center text-sm hover:opacity-75 transition mb-6 flex-row"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {language === "en"
          ? "Back to course setup"
          : "Kembali ke pengaturan kursus"}
      </Link>
    </div>
  );
};

export { BackToCourseSetup };
