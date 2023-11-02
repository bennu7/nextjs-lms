"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";
import { Course } from "@prisma/client";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLanguageContext } from "@/context/language-context";

export const columns: ColumnDef<
  Course & {
    slugName: string;
  }
>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      const { language } = useLanguageContext();
      return (
        <Button
          size={"sm"}
          className="px-1"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {language === "en" ? "Title" : "Judul"}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      const { language } = useLanguageContext();
      return (
        <Button
          size={"sm"}
          className="px-1"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {language === "en" ? "Price" : "Harga"}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price") || "0");
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "isPublished",
    header: ({ column }) => {
      const { language } = useLanguageContext();
      return (
        <Button
          size={"sm"}
          className="px-1"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {/* Published */}
          {language === "en" ? "Published" : "Diterbitkan"}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isPublised =
        row.getValue("isPublished") || row.original.isPublished || false;

      return (
        <Badge className={cn("bg-slate-500", isPublised && "bg-sky-700")}>
          {isPublised ? "Published" : "Draft"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { slugName } = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-4 w-8 p-0">
              <span className="sr-only">Open Menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/teacher/courses/${slugName}`}>
              <DropdownMenuItem>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
