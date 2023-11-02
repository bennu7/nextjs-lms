"use client";

import React, { useState, useEffect } from "react";
import { LayoutDashboard } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";
import { useLanguageContext } from "@/context/language-context";

const CustomizeCourse = () => {
  const [mount, setMount] = useState(false);
  const { language } = useLanguageContext();

  useEffect(() => {
    setMount(true);
  }, []);
  if (!mount) return null;

  return (
    <div className="flex items-center gap-x-2">
      <IconBadge icon={LayoutDashboard} />
      <h2 className="text-xl">
        {/* Customize your course */}
        {language === "en" ? "Customize your course" : "Sesuaikan kursus Anda"}
      </h2>
    </div>
  );
};

export { CustomizeCourse };
