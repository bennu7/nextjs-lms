"use client";

import React, { useState, useEffect } from "react";
import { Trash, Loader } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface CourseActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
  slugCourse: string;
}
const CourseActions: React.FC<CourseActionsProps> = ({
  courseId,
  disabled,
  isPublished,
  slugCourse,
}) => {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const confetti = useConfettiStore();

  const router = useRouter();

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/courses/${courseId}`);

      toast.success("Course deleted successfully");
    } catch (err: any) {
      toast.error(
        `Failed to delete course, detail: ${JSON.stringify(
          err.response.data || err.message || err
        )}`
      );
    } finally {
      setIsLoading(false);
      router.push(`/teacher/courses`);
    }
  };

  const onClickIsPublish = async () => {
    try {
      setIsLoading(true);
      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/unpublish`);

        toast.success("Course unpublished successfully");
      } else {
        await axios.patch(`/api/courses/${courseId}/publish`);

        toast.success("Course published successfully");
        confetti.onOpen();
      }
    } catch (err: any) {
      toast.error(
        `Failed to update publish course, detail: ${JSON.stringify(
          err.response.data || err.message || err
        )}`
      );
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClickIsPublish}
        disabled={disabled || isLoading}
        variant={"outline"}
        size={"sm"}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size={"sm"} variant={"destructive"} disabled={isLoading}>
          {
            <>
              {isLoading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Trash className="h-4 w-4" />
              )}
            </>
          }
        </Button>
      </ConfirmModal>
    </div>
  );
};

export { CourseActions };
