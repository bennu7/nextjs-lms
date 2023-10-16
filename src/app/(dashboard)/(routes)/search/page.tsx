import React from "react";
import { Category } from "@prisma/client";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { SearchInput } from "@/components/search-input";
import { getCourses } from "@/actions/get-courses";
import { CoursesList } from "@/components/courses-list";

import Categories from "./_components/categories";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
    category?: string;
  };
}
const SearchPage = async ({ searchParams }: SearchPageProps) => {
  type CategoryWithSlugName = Category & { slugName: string };
  const { userId } = auth();

  // if (!userId) return redirect("/");
  if (!userId) return null;

  let categories = (await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  })) as CategoryWithSlugName[];

  const slugName = categories.map((category) =>
    category.name.split(" ").join("-").toLowerCase()
  );

  // join slugNames with categories
  categories = categories.map((category, index) => ({
    ...category,
    slugName: slugName[index],
  })) as CategoryWithSlugName[];

  const courses = await getCourses({
    userId,
    categoryId: searchParams.categoryId,
    title: searchParams.title,
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Categories items={categories} />
        <CoursesList items={courses} />
      </div>
    </>
  );
};

export default SearchPage;
