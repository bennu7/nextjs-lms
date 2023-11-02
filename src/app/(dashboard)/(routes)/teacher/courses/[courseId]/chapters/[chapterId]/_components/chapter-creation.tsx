"use client";

import React, { useState, useEffect } from "react";
import { useLanguageContext } from "@/context/language-context";

interface ChapterCreationProps {
  completionText: string;
}
const ChapterCreation: React.FC<ChapterCreationProps> = ({
  completionText,
}) => {
  const [mount, setMount] = useState(false);
  const { language } = useLanguageContext();

  useEffect(() => {
    setMount(true);
  }, []);
  if (!mount) return null;

  return (
    <div className="flex flex-col gap-y-2">
      <h1 className="text-2xl font-medium">
        {language === "en" ? "Chapter creation" : "Pembuatan bab"}
      </h1>
      <span className="text-sm text-slate-700">
        {language === "en" ? "Complete all fields " : "Lengkapi semua bidang "}{" "}
        {completionText}
      </span>
    </div>
  );
};

export { ChapterCreation };
