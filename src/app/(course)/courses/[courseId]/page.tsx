import React from "react";

interface CourseIdPageProps {
  params: {
    courseId: string;
  };
}
const CourseIdPage:React.FC<CourseIdPageProps> = ({params}) => {
  return <div>watch course from {params.courseId}</div>;
};

export default CourseIdPage;
