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
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { useLanguageContext } from "@/context/language-context";

const formSchema = z.object({
  price: z.coerce.number().min(1, {
    message: "Price must be greater than 1",
  }),
});

interface PriceFormProps {
  initialData: Course;
  courseId: string;
}
const PriceForm: React.FC<PriceFormProps> = ({ courseId, initialData }) => {
  const [mount, setMount] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { language } = useLanguageContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData.price || 0,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { status } = await axios.patch(`/api/courses/${courseId}`, values);

      if (status !== 200) {
        toast.error("Failed to update course price");
        router.refresh();
        return;
      }

      toast.success("Course price updated");
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
        {language === "en" ? "Course Price" : "Harga Kursus"}
        <Button variant={"ghost"} onClick={toggleEdit}>
          {isEditing ? (
            <span>{language === "en" ? "Cancel" : "Batal"}</span>
          ) : (
            <div className="flex flex-row">
              <Pencil className="w-4 h-4 mr-2" />
              <span>{language === "en" ? "Edit Price" : "Ubah Harga"}</span>
            </div>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.price && "text-slate-500 italic"
          )}
        >
          {initialData.price
            ? formatPrice(initialData.price)
            : language === "en"
            ? "No price"
            : "Tidak ada harga"}
        </p>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      disabled={isSubmitting}
                      placeholder={
                        language === "en"
                          ? "set a price for your course"
                          : "tetapkan harga untuk kursus anda"
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

export { PriceForm };
