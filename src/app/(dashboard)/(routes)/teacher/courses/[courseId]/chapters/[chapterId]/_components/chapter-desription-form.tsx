"use client";

import React, { useState, useEffect } from "react";
import { Chapter } from "@prisma/client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";
import { useLanguageContext } from "@/context/language-context";

const formSchema = z.object({
  desc: z
    .string()
    .min(14, "Description required and must be at least 4 characters")
    .trim(),
});

interface ChapterDescriptionFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}
const ChapterDescriptionForm: React.FC<ChapterDescriptionFormProps> = ({
  initialData,
  courseId,
  chapterId,
}) => {
  const [mount, setMount] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { language } = useLanguageContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      desc: initialData.desc || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { status } = await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );

      if (status !== 200) {
        toast.error("Failed to update chapter description");
        router.refresh();
        return;
      }

      toast.success("Chapter description updated");
      toggleEdit();
      router.refresh();
    } catch (err: any) {
      toast.error(
        `Failed to update description chapters, detail: ${JSON.stringify(
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
    <div className="p-4 mt-6 border rounded-md bg-slate-100">
      <div className="flex items-center justify-between font-medium">
        {language === "en" ? "Chapter Description" : "Deskripsi Bab"}
        <Button variant={"ghost"} onClick={toggleEdit}>
          {isEditing ? (
            <span>{language === "en" ? "Cancel" : "Batal"}</span>
          ) : (
            <div className="flex flex-row">
              <Pencil className="w-4 h-4 mr-2" />
              <span>
                {language === "en" ? "Edit description" : "Ubah Deskripsi"}
              </span>
            </div>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.desc && "text-slate-500 italic"
          )}
        >
          {/* {initialData.desc || "No description"} */}
          <Preview
            value={
              !initialData.desc
                ? language === "en"
                  ? "No Description"
                  : "Tidak ada deskripsi"
                : initialData.desc
            }
          />
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Editor onChange={field.onChange} value={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={isSubmitting || !isValid} type="submit">
                {language === "en" ? "Save" : "Simpan"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export { ChapterDescriptionForm };
