import React from "react";
import { Category } from "@prisma/client";

import { db } from "@/lib/db";

import Categories from "./_components/categories";
import { SearchInput } from "@/components/search-input";

const SearchPage = async () => {
  type CategoryWithSlugName = Category & { slugName: string };

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

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6">
        <Categories items={categories} />
      </div>
    </>
  );
};

export default SearchPage;
