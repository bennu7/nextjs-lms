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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useLanguageContext } from "@/context/language-context";

const formSchema = z.object({
  description: z
    .string()
    .min(10, "Description required and must be at least 3 characters")
    .trim(),
});

interface DescriptionFormProps {
  initialData: Course;
  courseId: string;
}
const DescriptionForm: React.FC<DescriptionFormProps> = ({
  courseId,
  initialData,
}) => {
  const [mount, setMount] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { language } = useLanguageContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData.description || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { status } = await axios.patch(`/api/courses/${courseId}`, values);

      if (status !== 200) {
        toast.error("Failed to update course description");
        router.refresh();
        return;
      }

      toast.success("Course description updated");
      toggleEdit();
      router.refresh();
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
        {language === "en" ? "Course Description" : "Deskripsi Kursus"}
        <Button variant={"ghost"} onClick={toggleEdit}>
          {isEditing ? (
            <span>{language === "en" ? "Cancel" : "Batal"}</span>
          ) : (
            <div className="flex flex-row">
              <Pencil className="w-4 h-4 mr-2" />
              <span>
                {language === "en" ? "Edit description" : "Ubah deskripsi"}
              </span>
            </div>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.description && "text-slate-500 italic"
          )}
        >
          {!initialData.description
            ? language === "en"
              ? "No description"
              : "Tidak ada deskripsi"
            : initialData.description}
        </p>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder={
                        language === "en"
                          ? "e.g. 'This course is about...'"
                          : "e.g. 'Kursus ini tentang...'"
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
                {language === "en" ? "Save" : "Simpan"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export { DescriptionForm };
