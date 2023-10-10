"use client";

import React, { useState, useEffect } from "react";
import { Trash, Loader } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";

interface ChapterActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
  slugCourse: string;
}
const ChapterActions: React.FC<ChapterActionsProps> = ({
  chapterId,
  courseId,
  disabled,
  isPublished,
  slugCourse,
}) => {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);

      toast.success("Chapter deleted successfully");
      router.push(`/teacher/courses/${slugCourse}`);
    } catch (err: any) {
      toast.error(
        `Failed to delete chapter, detail: ${JSON.stringify(
          err.message || err
        )}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onClickIsPublish = async () => {
    try {
      setIsLoading(true);
      if (isPublished) {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/unpublish`
        );

        toast.success("Chapter unpublished successfully");
      } else {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/publish`
        );
        toast.success("Chapter published successfully");
      }
    } catch (err: any) {
      toast.error(
        `Failed to update publish chapter, detail: ${JSON.stringify(
          err.message || err
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

export { ChapterActions };
