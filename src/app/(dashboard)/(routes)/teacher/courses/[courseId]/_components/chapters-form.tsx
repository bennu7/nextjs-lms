"use client";

import React, { useState, useEffect } from "react";
import { Course, Chapter } from "@prisma/client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter, useParams, usePathname } from "next/navigation";

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
    router.push(`/dashboard/courses/${getLastPathName}/chapters/${chapterId}`);
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
        Course Chapters
        <Button variant={"ghost"} onClick={toggleCreating}>
          {isCreating ? (
            <span>Cancel</span>
          ) : (
            <div className="flex flex-row">
              <PlusCircle className="w-4 h-4 mr-2" />
              <span>Add a chapter</span>
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
                      placeholder="e.g. 'This chapter is about Introduction to the course...'"
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
                Create
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
          {!initialData.chapters.length && "No Chapters"}
          <ChaptersList
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.chapters || []}
          />
        </div>
      )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drop to reorder the chapters
        </p>
      )}
    </div>
  );
};

export { ChaptersForm };
