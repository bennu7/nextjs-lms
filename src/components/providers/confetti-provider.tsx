"use client";

import { useState, useEffect } from "react";
import ReactConfett from "react-confetti";

import { useConfettiStore } from "@/hooks/use-confetti-store";

const ConfettiProvider = () => {
  const [mounted, setIsMounted] = useState(false);
  const confetti = useConfettiStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!mounted || !confetti.isOpen) return null;

  return (
    <ReactConfett
      className="pointer-events-none z-[100]"
      numberOfPieces={600}
      recycle={false}
      onConfettiComplete={() => {
        confetti.onClose();
      }}
    />
  );
};

export { ConfettiProvider };
