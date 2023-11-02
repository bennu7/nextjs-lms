"use client";

import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { Loader2, Lock } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface VideoReactPlayerProps {
  url: string;
  chapterId?: string;
  title: string;
  courseId: string;
  nextChapterId?: string;
  playbackId?: string;
  isLocked: boolean;
  completeOnEnd?: boolean;
}
const VideoReactPlayer: React.FC<VideoReactPlayerProps> = ({
  url,
  chapterId,
  title,
  courseId,
  nextChapterId,
  playbackId,
  isLocked,
  completeOnEnd,
}) => {
  const [mounted, setMounted] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const router = useRouter();
  const confetti = useConfettiStore();

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(
          `/api/courses/${courseId}/chapters/${chapterId}/progress`,
          {
            isCompleted: true,
          }
        );
        toast.success("Chapter marked as complete!");

        router.refresh();
        if (nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        }

        if (!nextChapterId) {
          confetti.onOpen();
        }
        return;
      }

      if (!nextChapterId) {
        confetti.onOpen();
      }

      toast.success("Chapter completed!");
      router.refresh();

      if (nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }
    } catch (err: any) {
      toast.error(
        `Error marking chapter as complete: ${JSON.stringify(
          err.message || err
        )}`
      );
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted)
    return (
      <div className="text-center text-xl text-sky-700 flex flex-col items-center justify-center">
        Loading . . .
      </div>
    );

  return (
    <div className="relative aspect-video">
      {!isLocked && !isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="w-8 h-8 text-secondary animate-spin" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 gap-y-2 text-secondary">
          <Lock className="w-8 h-8" />
          <p className="text-sm"> This chapter is locked.</p>
        </div>
      )}
      <div className={cn(!isReady && "hidden")}>
        <ReactPlayer
          url={url}
          className="absolute inset-0"
          controls
          config={{
            file: {
              attributes: {
                controlsList: "nodownload",
                disablePictureInPicture: true,
              },
            },
          }}
          width="100%"
          height="100%"
          onEnded={onEnd}
          onPlay={() => setIsReady(true)}
        />
      </div>
    </div>
  );
};

export { VideoReactPlayer };
