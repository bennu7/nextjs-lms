"use client";

import React, { useState, useEffect } from "react";

import { cn } from "@/lib/utils";
import { useLanguageContext } from "@/context/language-context";
import { Progress } from "./ui/progress";

interface CourseProgressProps {
  value: number;
  variant?: "default" | "success";
  size?: "default" | "sm";
}

const colorByVariant = {
  default: "text-sky-700",
  success: "text-emerald-700",
};

const sizeByvariant = {
  default: "text-sm",
  sm: "text-xs",
};

const CourseProgress: React.FC<CourseProgressProps> = ({
  value,
  variant,
  size,
}) => {
  const [mounted, setMounted] = useState(false);
  const { language } = useLanguageContext();

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <div>
      <Progress variant={variant} className="h-2" value={value} />
      <p
        className={cn(
          "font-medium mt-2 text-sky-700",
          colorByVariant[variant || "default"],
          sizeByvariant[size || "default"]
        )}
      >
        {Math.round(value)}% {language === "en" ? "Complete" : "Selesai"}
      </p>
    </div>
  );
};

export { CourseProgress };
