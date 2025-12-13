"use client";

import React from "react";
import MacWindow from "@/components/macos-components/MacWindow";
import Sidebar from "@/components/dashboard-components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center h-dvh w-screen p-4 md:p-8">
      <MacWindow
        title="System Settings"
        className="w-full h-full max-w-[1200px] max-h-[800px] shadow-2xl overflow-hidden border border-white/10"
      >
        <div className="flex h-full w-full">
          {/* Sidebar */}
          <Sidebar />
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto min-w-0 p-8 
                           bg-[#1e1e1e]/95 backdrop-blur-3xl
                           text-white no-scrollbar">
            {children}
          </main>
        </div>
      </MacWindow>
    </div>
  );
}