"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}
const SidebarItem: React.FC<SidebarItemProps> = ({
  href,
  icon: Icon,
  label,
}) => {
  const pathName = usePathname();
  const router = useRouter();

  const isActive =
    (pathName === "/" && href === "/") ||
    pathName === href ||
    pathName?.startsWith(`${href}/`);

  const onClick = () => {
    router.push(href);
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex flex-row items-center gap-x-2 text-slate-500",
        "text-sm font-[500] pl-6 transition-all duration-200",
        "ease-in-out hover:text-slate-600 hover:bg-slate-300/20",
        isActive &&
          "text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700"
      )}
    >
      <div className="flex items-center py-4 gap-x-2">
        <Icon
          size={22}
          className={cn("text-slate-500", isActive && "text-sky-700")}
        />
        <span>{label}</span>
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-sky-700 h-full transition-all duration-200",
          isActive && "opacity-100"
        )}
      />
    </button>
  );
};

export { SidebarItem };
