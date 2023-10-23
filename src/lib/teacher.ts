export const isTeacher = (userId: string | null): boolean => {
  return userId === process.env.NEXT_PUBLIC_TEACHER_ID;
};
