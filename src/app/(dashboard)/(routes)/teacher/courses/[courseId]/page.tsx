import React from "react";

interface CourseIdPageProps {
  params: {
    courseId: string;
  };
}
const CourseIdPage: React.FC<CourseIdPageProps> = ({ params }) => {
  return <div>CourseIdPage {params.courseId.replace(/-/g, " ")}</div>;
};

export default CourseIdPage;
