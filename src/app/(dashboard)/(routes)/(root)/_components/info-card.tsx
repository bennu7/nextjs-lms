import React from "react";
import { LucideIcon } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";
import { useLanguageContext } from "@/context/language-context";

interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  numberOfItems: number;
  variant?: "default" | "success";
}
const InfoCard: React.FC<InfoCardProps> = ({
  icon: Icon,
  label,
  numberOfItems,
  variant,
}) => {
  const { language } = useLanguageContext();

  return (
    <div className="border rounded-md flex items-center gap-x-2 p-3">
      <IconBadge icon={Icon} variant={variant} />
      <div className="">
        <p className="font-medium">{label}</p>
        <p className="text-gray-500 text-sm">
          {numberOfItems}{" "}
          {numberOfItems === 1
            ? language === "en"
              ? "Course"
              : "Kursus"
            : language === "en"
            ? "Courses"
            : "Kursus"}
        </p>
      </div>
    </div>
  );
};

export { InfoCard };
