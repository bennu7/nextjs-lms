"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { type Metadata } from "next";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguageContext } from "@/context/language-context";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

const metadata: Metadata = {
  title: "Create Course",
  description: "Create a new course",
};

const CreatePage = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { language } = useLanguageContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/courses", values);
      toast.success("Course created");
      const convertSlug = (response.data.title as string)
        .replace(/\s+/g, "-")
        .toLowerCase();
      router.push(`/teacher/courses/${convertSlug}`);
      // router.push(`/teacher/courses/${response.data.id}`);
    } catch (err: any) {
      toast.error("Something went wrong", err);
      console.error("ERROR onSubmit /api/courses", err);
    }
  };

  useEffect(() => {
    document.title = metadata.title as string;
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <div className="flex h-full max-w-5xl p-6 mx-auto md:items-center md:justify-center">
      <div className="">
        <h1 className="text-2xl">
          {language === "en" ? "Name Course" : "Nama Kursus"}
        </h1>
        <p className="text-sm text-slate-600">
          {/* What would you like to name your course? Don&apos;t worry, you can
          change this later. */}
          {language === "en"
            ? "What would you like to name your course? Don't worry, you can change this later."
            : "Apa yang ingin Anda namakan kursus Anda? Jangan khawatir, Anda dapat mengubahnya nanti."}
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-8 "
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {language === "en" ? "Course title" : "Judul kursus"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={
                        language === "en"
                          ? "w.g. 'Introduction to Computer Science'"
                          : "w.g. 'Pengantar Ilmu Komputer'"
                      }
                      className="w-full"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    {language === "en"
                      ? "What will you teach in this course?"
                      : "Apa yang akan Anda ajarkan dalam kursus ini?"}
                  </FormDescription>
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link href={"/"}>
                <Button type="button" variant={"ghost"}>
                  {language === "en" ? "Cancel" : "Batal"}
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                {language === "en" ? "Create" : "Buat"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePage;
