"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguageContext } from "@/context/language-context";

interface ComboboxProps {
  options: { label: string; value: string }[];
  value?: string;
  onChange: (value: string) => void;
}
export const Combobox: React.FC<ComboboxProps> = ({
  options,
  value,
  onChange,
}) => {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const { language } = useLanguageContext();

  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : language === "en"
            ? "Select option..."
            : "Pilih opsi..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search option..." />
          <CommandEmpty>
            {language === "en"
              ? "No option found."
              : "Tidak ada opsi ditemukan."}
          </CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={(currentValue) => {
                  onChange(currentValue === value ? "" : option.value);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
