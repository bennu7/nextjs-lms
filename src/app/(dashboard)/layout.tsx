import React from "react";

import { Sidebar } from "./_components/sidebar";
import { Navbar } from "./_components/navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-full">
      <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full">
        <Navbar />
      </div>
      <div className="fixed inset-y-0 z-50 flex-col hidden w-56 h-full md:flex">
        <Sidebar />
      </div>
      <main className="md:pl-56">{children}</main>
    </div>
  );
};

export default DashboardLayout;
