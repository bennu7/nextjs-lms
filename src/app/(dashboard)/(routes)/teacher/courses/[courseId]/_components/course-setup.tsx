"use client";

import React, { FC, useState, useEffect } from "react";

import { useLanguageContext } from "@/context/language-context";

interface CourseSetupProps {
  completionText: string;
}
const CourseSetup: FC<CourseSetupProps> = ({ completionText }) => {
  const [mount, setMount] = useState(false);
  const { language } = useLanguageContext();

  useEffect(() => {
    setMount(true);
  }, []);
  if (!mount) return null;

  return (
    <div className="flex flex-col gap-y-2">
      <h1 className="text-2xl font-medium">
        {language === "en" ? "Course setup" : "Pengaturan kursus"}
      </h1>
      <span className="text-sm text-slate-700">
        {language === "en" ? "Complete all fields " : "Lengkapi semua bidang "}
        {completionText}
      </span>
    </div>
  );
};

export { CourseSetup };
