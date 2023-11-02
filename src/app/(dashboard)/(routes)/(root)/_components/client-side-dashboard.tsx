"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, Clock } from "lucide-react";

import { CourseWithProgressWithCategory } from "@/actions/get-dashboard-courses";
import { useLanguageContext } from "@/context/language-context";

import { InfoCard } from "./info-card";

interface ClientSideDashboardProps {
  courseInProgress: CourseWithProgressWithCategory[];
  completedCourses: CourseWithProgressWithCategory[];
}
const ClientSideDashboard: React.FC<ClientSideDashboardProps> = ({
  completedCourses,
  courseInProgress,
}) => {
  const [mounted, setMounted] = useState(false);
  const { language } = useLanguageContext();

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <InfoCard
        icon={Clock}
        label={
          language === "en"
            ? "Courses in progress"
            : "Kursus sedang berlangsung"
        }
        numberOfItems={courseInProgress.length}
      />
      <InfoCard
        icon={CheckCircle}
        label={language === "en" ? "Completed" : "Selesai"}
        numberOfItems={completedCourses.length}
        variant="success"
      />
    </div>
  );
};

export { ClientSideDashboard };
