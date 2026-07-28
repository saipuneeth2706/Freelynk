"use client";

import { useState } from "react";
import FreelancerSidebar from "@/components/FreelancerSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="dark flex min-h-screen bg-[#0B0B0F]">
      <FreelancerSidebar
        collapsed={collapsed}
        onCollapse={setCollapsed}
      />
      <main
        className="flex-1 overflow-y-auto transition-[padding] duration-200"
        style={{ paddingLeft: collapsed ? 68 : 240 }}
      >
        <div className="mx-auto max-w-5xl px-6 py-8 lg:px-10 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
