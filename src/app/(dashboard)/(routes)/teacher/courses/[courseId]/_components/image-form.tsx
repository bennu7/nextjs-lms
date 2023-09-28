"use client";

import React, { useState, useEffect } from "react";
import { Course } from "@prisma/client";
import * as z from "zod";
import axios from "axios";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";

const formSchema = z.object({
  imageUrl: z.string().min(1, "Image is required").trim(),
});

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}
const ImageForm: React.FC<ImageFormProps> = ({ courseId, initialData }) => {
  const [mount, setMount] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { status } = await axios.patch(`/api/courses/${courseId}`, values);

      if (status !== 200) {
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

  const toggleEdit = () => setIsEditing((prev) => !prev);

  useEffect(() => {
    setMount(true);
  }, []);
  if (!mount) return null;

  return (
    <div className="flex flex-col p-4 mt-6 border rounded-md bg-slate-100">
      <div className="flex items-center justify-between font-medium">
        Course Image
        <Button variant={"ghost"} onClick={toggleEdit}>
          {isEditing && <span>Cancel</span>}
          {!isEditing &&
            (!initialData.imageUrl ? (
              <>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add an image
              </>
            ) : (
              <>
                <Pencil className="h-4 w-4 mr-2" />
                Edit image
              </>
            ))}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="Upload"
              fill
              className="object-cover rounded-md"
              src={initialData.imageUrl as string}
            />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
};

export { ImageForm };
