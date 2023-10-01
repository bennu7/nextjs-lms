"use client";

import React, { useState, useEffect } from "react";
import { Attachment, Course } from "@prisma/client";
import * as z from "zod";
import axios from "axios";
import { File, Loader2, PlusCircle, X } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";

const formSchema = z.object({
  url: z.string().url(),
});

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}
const AttachmentForm: React.FC<AttachmentFormProps> = ({
  courseId,
  initialData,
}) => {
  const [mount, setMount] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { status } = await axios.post(
        `/api/courses/${courseId}/attachments`,
        values
      );

      if (status !== 201 && status !== 200) {
        toast.error("Failed to update course image");
        router.refresh();
        return;
      }

      toast.success("Course image updated");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error(
        `Failed to update course image, detail: ${JSON.stringify(error)}`
      );
      console.error(error);
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const { status } = await axios.delete(
        `/api/courses/${courseId}/attachments/${id}`
      );

      if (status !== 200) {
        toast.error("Failed to delete attachment");
        setDeletingId(null);
        return;
      }

      toast.success("Attachment deleted");
      router.refresh();
    } catch (err: any) {
      toast.error(
        `Failed to create chapters, detail: ${JSON.stringify(
          err.message || err
        )}`
      );
    } finally {
      setDeletingId(null);
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
        Course Attachment
        <Button variant={"ghost"} onClick={toggleEdit}>
          {isEditing && <span>Cancel</span>}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No attachment found. Please add a file to this course.
            </p>
          )}
          {initialData.attachments.length > 0 && (
            // <div className="flex flex-col gap-y-2 mt-2">
            <div className="space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                >
                  <File className="h-4 w-4 flex-shrink-0" />
                  <p className="text-xs line-clamp-1">{attachment.name}</p>
                  {deletingId === attachment.id && (
                    <div className="ml-auto">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== attachment.id && (
                    <button
                      onClick={() => onDelete(attachment.id)}
                      className="ml-auto hover:opacity-75 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Add anything your students might need to complete your course.
          </div>
        </div>
      )}
    </div>
  );
};

export { AttachmentForm };
