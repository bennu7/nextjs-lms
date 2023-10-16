"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import qs from "query-string";

import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "./ui/input";

const SearchInput = () => {
  const [mounted, setMounted] = useState(false);
  const [value, setValue] = useState("");
  const debouncedvalue = useDebounce(value);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // const currentCategoryId = searchParams.get("categoryId");
  const currentCategory = searchParams.get("category");

  useEffect(() => {
    setMounted(true);

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          // categoryId: currentCategoryId,
          category: currentCategory,
          title: debouncedvalue,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  }, [currentCategory, debouncedvalue, pathname, router]);

  if (!mounted) return null;

  return (
    <div className="relative">
      <Search className="w-4 h-4 absolute top-3 left-3 text-slate-600" />
      <Input
        onChange={(e) => setValue(e.target.value)}
        value={value}
        className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
        placeholder="Search for a course"
      />
    </div>
  );
};

export { SearchInput };
