"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, CheckCircleIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { useLanguageContext } from "@/context/language-context";

const bannerVariants = cva(
  "border text-center p-4 text-sm flex items-center w-full",
  {
    variants: {
      variant: {
        warning: "bg-yellow-200/80 border-yellow-30 text-primary",
        success: "bg-emerald-700 border-emerald-800 text-secondary",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  }
);

interface BannerProps extends VariantProps<typeof bannerVariants> {
  labelEn: string;
  labelId: string;
}

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircleIcon,
};

const Banner: React.FC<BannerProps> = ({ labelEn, labelId, variant }) => {
  const [mounted, setMounted] = useState(false);
  const { language } = useLanguageContext();

  const Icon = iconMap[variant || "warning"];

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <div className={cn(bannerVariants({ variant }))}>
      <Icon className="mr-2 h-4 w-4" />
      <span>{language === "en" ? labelEn : labelId}</span>
    </div>
  );
};

export { Banner };
