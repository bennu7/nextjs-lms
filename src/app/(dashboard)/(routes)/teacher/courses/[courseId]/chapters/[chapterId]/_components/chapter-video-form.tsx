"use client";

import React, { useState, useEffect } from "react";
import { Chapter, MuxData } from "@prisma/client";
import * as z from "zod";
import axios from "axios";
import { Pencil, PlusCircle, Video } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import MuxPlayer from "@mux/mux-player-react";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";

const formSchema = z.object({
  videoUrl: z.string().min(1).trim(),
});

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}
const ChapterVideoForm: React.FC<ChapterVideoFormProps> = ({
  courseId,
  initialData,
  chapterId,
}) => {
  const [mount, setMount] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { status } = await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );

      if (status !== 200) {
        toast.error("Failed to update chapter video");
        router.refresh();
        return;
      }

      toast.success("Chapter video updated");
      toggleEdit();
      router.refresh();
    } catch (err: any) {
      toast.error(
        `Failed to update chapters, detail: ${JSON.stringify(
          err.message || err
        )}`
      );
    }
  };

  const toggleEdit = () => setIsEditing((prev) => !prev);

  useEffect(() => {
    setMount(true);
  }, []);
  if (!mount) return null;

  return (
    <div className="flex flex-col p-4 mt-6 border rounded-md bg-slate-100">
      <div className="flex items-center justify-between font-medium">
        Course Video
        <Button variant={"ghost"} onClick={toggleEdit}>
          {isEditing && <span>Cancel</span>}
          {!isEditing &&
            (!initialData.videoUrl ? (
              <>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add a video
              </>
            ) : (
              <>
                <Pencil className="h-4 w-4 mr-2" />
                Edit video
              </>
            ))}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <MuxPlayer
              playbackId={initialData.muxData?.playbackId || ""}
              // metadata={}
            />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Upload this chapter&apos;s video
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process. Refresh to the page if video
          does not appear.
        </div>
      )}
    </div>
  );
};

export { ChapterVideoForm };
