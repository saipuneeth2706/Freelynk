"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  Building2,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";

const navItems = [
  {
    label: "Overview",
    href: "/employer_dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    href: "/employer_dashboard/projects",
    icon: FolderKanban,
  },
  {
    label: "Company",
    href: "/employer_dashboard/company",
    icon: Building2,
  },
  {
    label: "Settings",
    href: "/employer_dashboard/settings",
    icon: Settings,
  },
];

interface EmployerSidebarProps {
  collapsed: boolean;
  onCollapse: (v: boolean) => void;
}

export default function EmployerSidebar({
  collapsed,
  onCollapse,
}: EmployerSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [companyName, setCompanyName] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: company } = await supabase
        .from("employer_table")
        .select("company_name")
        .eq("user_id", data.user.id)
        .limit(1)
        .maybeSingle();
      if (company) setCompanyName(company.company_name);
    });
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const isActive = (href: string) => {
    if (href === "/employer_dashboard") {
      return pathname === "/employer_dashboard";
    }
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "flex items-center gap-3 border-b border-white/[0.06] px-5 py-5",
          collapsed && "justify-center px-0"
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#7B3FE4]/15 text-[#c084fc]">
          <Building2 className="h-4 w-4" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {companyName || "Company"}
            </p>
            <p className="text-xs text-neutral-500">Employer</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                collapsed && "justify-center px-0",
                active
                  ? "bg-[#7B3FE4]/10 text-[#c084fc]"
                  : "text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-200"
              )}
            >
              <item.icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0 transition-colors duration-150",
                  active
                    ? "text-[#c084fc]"
                    : "text-neutral-500 group-hover:text-neutral-300"
                )}
              />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/[0.06] px-3 py-3">
        <button
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-400 transition-colors duration-150 hover:bg-white/[0.04] hover:text-neutral-200",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-9 w-9 items-center justify-center rounded-lg bg-[#1B1722] text-neutral-400 ring-1 ring-white/[0.08] transition-colors hover:text-white lg:hidden"
      >
        <Menu className="h-4 w-4" />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-[#0E0E12] transition-all duration-200 ease-out",
          "lg:translate-x-0",
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
          collapsed ? "w-[68px]" : "w-[240px]"
        )}
      >
        <button
          onClick={() => onCollapse(!collapsed)}
          className="absolute -right-3 top-6 z-50 hidden h-6 w-6 items-center justify-center rounded-full bg-[#1B1722] text-neutral-500 ring-1 ring-white/[0.08] transition-colors hover:text-white lg:flex"
        >
          <ChevronLeft
            className={cn(
              "h-3 w-3 transition-transform duration-200",
              collapsed && "rotate-180"
            )}
          />
        </button>

        {sidebarContent}
      </aside>
    </>
  );
}
