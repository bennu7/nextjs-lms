"use client";

import React from "react";
import { IconType } from "react-icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

import { cn } from "@/lib/utils";

interface CategoryItemProps {
  label: string;
  slugName?: string;
  value?: string;
  icon?: IconType;
}
const CategoryItem: React.FC<CategoryItemProps> = ({
  label,
  slugName,
  value,
  icon: Icon,
}) => {
  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // const currentCategoryId = searchParams.get("categoryId");
  const currentCategory = searchParams.get("category");
  const currentTitle = searchParams.get("title");

  // const isSelected = currentCategoryId === value;
  const isSelected = currentCategory === slugName;

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathName,
        query: {
          title: currentTitle,
          // categoryId: isSelected ? null : value, // ini jika sudah terpilih maka akan di unselect
          category: isSelected ? null : slugName,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "border-slate-200 py-2 px-3 rounded-full flex items-center gap-x-1 hover:border-sky-700 transition hover:text-sky-700",
        isSelected && "bg-sky-200/20 text-sky-800 border-sky-700"
      )}
      type="button"
    >
      {Icon && <Icon size={20} />}
      <div className="truncate">{label}</div>
    </button>
  );
};

export default CategoryItem;
