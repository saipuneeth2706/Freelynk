"use client";

import { useState, createContext, useContext } from "react";
import EmployerSidebar from "@/components/EmployerSidebar";

const SidebarContext = createContext<{
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}>({ collapsed: false, setCollapsed: () => {} });

export function useSidebar() {
  return useContext(SidebarContext);
}

export default function EmployerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <div className="dark flex min-h-screen bg-[#0B0B0F]">
        <EmployerSidebar
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
    </SidebarContext.Provider>
  );
}
