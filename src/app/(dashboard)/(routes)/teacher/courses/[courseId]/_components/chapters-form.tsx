"use client";

import React, { useState, useEffect } from "react";
import { Course, Chapter } from "@prisma/client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter, usePathname } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useLanguageContext } from "@/context/language-context";

import { ChaptersList } from "./chapterts-list";

const formSchema = z.object({
  title: z
    .string()
    .min(4, "Title required and must be at least 4 character")
    .trim(),
});

interface ChaptersFormProps {
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
}
const ChaptersForm: React.FC<ChaptersFormProps> = ({
  courseId,
  initialData,
}) => {
  const [mount, setMount] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const getLastPathName = pathname.split("/").slice(-1)[0];
  const { language } = useLanguageContext();
  console.log("🚀 ~ file: chapters-form.tsx:49 ~ language:", language);
  console.log(!initialData.chapters.length);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { status } = await axios.post(
        `/api/courses/${courseId}/chapters`,
        values
      );

      if (status !== 201) {
        toast.error("Failed to create chapters");
        router.refresh();
        return;
      }

      toast.success("Chapters created");
      toggleCreating();
      router.refresh();
    } catch (err: any) {
      toast.error(
        `Failed to CREATE chapters, detail: ${JSON.stringify(
          err.message || err
        )}`
      );
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);
      const { status } = await axios.put(
        `/api/courses/${courseId}/chapters/reorder`,
        {
          list: updateData,
        }
      );

      if (status !== 200) {
        toast.error("Failed to update chapter reordered");
        router.refresh();
        return;
      }

      toast.success("List reordered Course Chapters updated");
      router.refresh();
    } catch (err: any) {
      toast.error(
        `Failed to PUT chapters reordered, detail: ${JSON.stringify(
          err.message || err
        )}`
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = async (chapterId: string) => {
    router.push(
      `/teacher/courses/${getLastPathName}/chapters/${chapterId
        .split(" ")
        .join("-")
        .toLowerCase()}`
    );
  };

  const toggleCreating = () => setIsCreating((prev) => !prev);

  useEffect(() => {
    setMount(true);
  }, []);
  if (!mount) return null;

  return (
    <div className="relative p-4 mt-6 border rounded-md bg-slate-100">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 right-0 top-0 rounded-md flex items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin text-sky-700" />
        </div>
      )}
      <div className="flex items-center justify-between font-medium">
        {language === "en" ? "Course Chapters" : "Bab Kursus"}
        <Button variant={"ghost"} onClick={toggleCreating}>
          {isCreating ? (
            <span>{language === "en" ? "Cancel" : "Batal"}</span>
          ) : (
            <div className="flex flex-row">
              <PlusCircle className="w-4 h-4 mr-2" />
              <span>
                {language === "en" ? "Add a chapter" : "Tambahkan bab"}
              </span>
            </div>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder={
                        language === "en"
                          ? "This chapter is about Introduction to the course...'"
                          : "Bab ini tentang Pengenalan kursus...'"
                      }
                      {...field}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={isSubmitting || !isValid} type="submit">
                {language === "en" ? "Create" : "Buat"}
              </Button>
            </div>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.chapters.length && "text-slate-500 italic"
          )}
        >
          {!initialData.chapters.length && (
            <span>{language === "en" ? "No chapters" : "Tidak ada bab"}</span>
          )}
          <ChaptersList
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.chapters || []}
          />
        </div>
      )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          {language === "en"
            ? "Drag and drop to reorder the chapters"
            : "Seret dan lepas untuk mengurutkan bab"}
        </p>
      )}
    </div>
  );
};

export { ChaptersForm };
