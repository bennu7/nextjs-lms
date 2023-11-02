import { auth } from "@clerk/nextjs";
import { CheckCircle, Clock } from "lucide-react";

import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { CoursesList } from "@/components/courses-list";
import { useLanguageContext } from "@/context/language-context";

import { InfoCard } from "./_components/info-card";
import { ClientSideDashboard } from "./_components/client-side-dashboard";

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) return null;

  const { completedCourses, courseInProgress } = await getDashboardCourses(
    userId
  );

  return (
    <div className="p-6 space-y-4">
      <ClientSideDashboard
        courseInProgress={courseInProgress}
        completedCourses={completedCourses}
      />
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="Courses in progress"
          numberOfItems={courseInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div> */}
      <CoursesList items={[...courseInProgress, ...completedCourses]} />
    </div>
  );
}
