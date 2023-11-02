"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { useLanguageContext } from "@/context/language-context";

interface CourseProgressButonProps {
  chapterId: string;
  courseId: string;
  nextChapterId?: string;
  isCompleted?: boolean;
}
const CourseProgressButon: React.FC<CourseProgressButonProps> = ({
  chapterId,
  courseId,
  nextChapterId,
  isCompleted,
}) => {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();
  const { language } = useLanguageContext();

  const onClick = async () => {
    try {
      setIsLoading(true);

      await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/progress`,
        {
          isCompleted: !isCompleted,
        }
      );

      if (!isCompleted && !nextChapterId) {
        confetti.onOpen();
      }

      if (!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }

      toast.success(
        // `Chapter ${isCompleted ? "not " : ""}completed successfully`
        "Progress updated"
      );
      router.refresh();
    } catch (err: any) {
      toast.error(`Error progress button: ${err.message || err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const Icon = isCompleted ? XCircle : CheckCircle;

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      type="button"
      variant={isCompleted ? "outline" : "success"}
      className="w-full md:w-auto"
    >
      {/* {isCompleted ? "Not Completed" : "Mark as complete"} */}
      {isCompleted
        ? language === "en"
          ? "Not Completed"
          : "Belum selesai"
        : language === "en"
        ? "Mark as complete"
        : "Tandai selesai"}
      <Icon className="h-4 w-4 ml-2" />
    </Button>
  );
};

export { CourseProgressButon };
