"use client";
import { useState, useEffect } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useLanguageContext } from "@/context/language-context";

interface ConfirmModalProps {
  children: React.ReactNode;
  onConfirm: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ children, onConfirm }) => {
  const [mounted, setMounted] = useState(false);
  const { language } = useLanguageContext();

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {language === "en" ? "Are you sure?" : "Apakah anda yakin?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {language === "en"
              ? "This action cannot be undone."
              : "Tindakan ini tidak dapat dibatalkan."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {language === "en" ? "Cancel" : "Batal"}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600">
            {language === "en" ? "Continue" : "Lanjutkan"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { ConfirmModal };
