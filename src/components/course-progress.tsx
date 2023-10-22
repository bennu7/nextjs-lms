"use client";

import React from "react";

import { cn } from "@/lib/utils";
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
        {Math.round(value)}% Complete
      </p>
    </div>
  );
};

export { CourseProgress };
