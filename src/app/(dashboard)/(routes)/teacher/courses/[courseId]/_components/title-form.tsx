"use client";

import React, { useState, useEffect } from "react";
import { Course } from "@prisma/client";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").trim(),
});

interface TitleFormProps {
  initialData: Course;
  courseId: string;
}
const TitleForm: React.FC<TitleFormProps> = ({ courseId, initialData }) => {
  const [mount, setMount] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data, status } = await axios.patch(
        `/api/courses/${courseId}`,
        values
      );

      if (status !== 200) {
        toast.error("Failed to update course title");
        router.refresh();
        return;
      }

      toast.success("Course title updated");
      toggleEdit();
      router.push((data.title as string).replace(/\s/g, "-").toLowerCase());
    } catch (err: any) {
      toast.error(
        `Failed to create chapters, detail: ${JSON.stringify(
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
        Course Title
        <Button variant={"ghost"} onClick={toggleEdit}>
          {isEditing ? (
            <span>Cancel</span>
          ) : (
            <div className="flex flex-row">
              <Pencil className="w-4 h-4 mr-2" />
              <span>Edit title</span>
            </div>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <p className="mt-2 text-sm ">{initialData.title}</p>
      ) : (
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
                      placeholder="e.g. 'Introduction to Computer Science'"
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
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export { TitleForm };
