"use client";

import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";

const MobileSidebar = () => {
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  if (!mount) return null;

  return (
    <Sheet>
      <SheetTrigger className="pr-4 transition md:hidden hover:opacity-75">
        <Menu />
      </SheetTrigger>
      <SheetContent side={"left"} className="p-0 bg-white">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};

export { MobileSidebar };
