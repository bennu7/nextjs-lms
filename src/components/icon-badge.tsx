import React from "react";
import { LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const backroundVariants = cva("rounded-full flex items-center justify-center", {
  variants: {
    variant: {
      default: "bg-sky-100",
      success: "bg-emerald-100",
    },
    size: {
      default: "p-2",
      sm: "p-1",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
    // iconVariant: "default",
  },
});

const iconVariants = cva("", {
  variants: {
    variant: {
      default: "text-sky-700",
      success: "text-emerald-700",
    },
    size: {
      default: "w-8 h-8",
      sm: "w-4 h-4",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type backgroundVariantProps = VariantProps<typeof backroundVariants>;
type iconVariantProps = VariantProps<typeof iconVariants>;

interface IconBadgeProps extends backgroundVariantProps, iconVariantProps {
  icon: LucideIcon;
}
const IconBadge: React.FC<IconBadgeProps> = ({ icon: Icon, variant, size }) => {
  return (
    <div
      className={cn(
        backroundVariants({
          variant,
          size,
        })
      )}
    >
      <Icon
        className={cn(
          iconVariants({
            variant,
            size,
          })
        )}
      />
    </div>
  );
};

export { IconBadge };
