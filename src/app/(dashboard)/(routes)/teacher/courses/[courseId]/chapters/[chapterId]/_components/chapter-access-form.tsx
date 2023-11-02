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
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguageContext } from "@/context/language-context";

const formSchema = z.object({
  isFree: z.boolean().default(false),
});

interface ChapterAccessFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}
const ChapterAccessForm: React.FC<ChapterAccessFormProps> = ({
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
      isFree: !!initialData.isFree,
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
        toast.error("Failed to update access chapter");
        router.refresh();
        return;
      }

      toast.success("Chapter access updated");
      toggleEdit();
      router.refresh();
    } catch (err: any) {
      toast.error(
        `Failed to update access chapters, detail: ${JSON.stringify(
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
        {language === "en" ? "Chapter access settings" : "Pengaturan akses bab"}
        <Button variant={"ghost"} onClick={toggleEdit}>
          {isEditing ? (
            <span>{language === "en" ? "Cancel" : "Batal"}</span>
          ) : (
            <div className="flex flex-row">
              <Pencil className="w-4 h-4 mr-2" />
              <span>{language === "en" ? "Edit access" : "Ubah akses"}</span>
            </div>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.isFree && "text-slate-500 italic"
          )}
        >
          {initialData.isFree ? (
            <>
              {language === "en"
                ? "this chapter is free for preview"
                : "bab ini gratis untuk pratinjau"}
            </>
          ) : (
            <>
              {language === "en"
                ? "This chapter is not free"
                : "Bab ini tidak gratis"}
            </>
          )}
        </p>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onChange={field.onChange}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormDescription>
                      {language === "en"
                        ? "Check this box if you want to make this chapter free for preview"
                        : "Centang kotak ini jika Anda ingin membuat bab ini gratis untuk pratinjau"}
                    </FormDescription>
                  </div>
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

export { ChapterAccessForm };
