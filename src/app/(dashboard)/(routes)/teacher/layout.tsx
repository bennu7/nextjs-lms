import React from "react";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { isTeacher } from "@/lib/teacher";

interface TeacherLayoutProps {
  children: React.ReactNode;
}
const TeacherLayout: React.FC<TeacherLayoutProps> = ({ children }) => {
  const { userId } = auth();

  if (!isTeacher(userId) || !userId) return redirect("/");

  return <>{children}</>;
};

export default TeacherLayout;
