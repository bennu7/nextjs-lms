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
import { cn } from "@/lib/utils";
import { Combobox } from "@/components/ui/combobox";

const formSchema = z.object({
  categoryId: z
    .string()
    .min(1, {
      message: "Please select a category",
    })
    .trim(),
});

interface CategoryFormProps {
  initialData: Course;
  courseId: string;
  options: {
    label: string;
    value: string;
  }[];
}
const CategoryForm: React.FC<CategoryFormProps> = ({
  courseId,
  initialData,
  options,
}) => {
  const [mount, setMount] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filled, setFilled] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData.categoryId || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { status } = await axios.patch(`/api/courses/${courseId}`, values);

      if (status !== 200) {
        toast.error("Failed to update course category");
        router.refresh();
        return;
      }

      toast.success("Course category updated");
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

  const selectedOption = options.find(
    (option) => option.value === initialData.categoryId
  );

  return (
    <div className="p-4 mt-6 border rounded-md bg-slate-100">
      <div className="flex items-center justify-between font-medium">
        Course Category
        <Button variant={"ghost"} onClick={toggleEdit}>
          {isEditing ? (
            <span>Cancel</span>
          ) : (
            <div className="flex flex-row">
              <Pencil className="w-4 h-4 mr-2" />
              <span>Edit category</span>
            </div>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.categoryId && "text-slate-500 italic"
          )}
        >
          {selectedOption?.label || "No category"}
        </p>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      options={options}
                      onChange={(value) => {
                        form.setValue("categoryId", value);
                        setFilled(!!value);
                      }}
                      value={field.value}
                      // {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!filled} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export { CategoryForm };
