"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Plus,
  Search,
  FolderKanban,
  FolderOpen,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  Trash2,
  ArrowUpDown,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  budget: number | null;
  created_at: string;
  updated_at: string;
}

const statusConfig: Record<
  string,
  { label: string; icon: typeof FolderOpen; color: string }
> = {
  draft: {
    label: "Draft",
    icon: Clock,
    color: "text-neutral-400 bg-neutral-400/10",
  },
  open: {
    label: "Open",
    icon: FolderOpen,
    color: "text-emerald-400 bg-emerald-400/10",
  },
  in_progress: {
    label: "In Progress",
    icon: Loader2,
    color: "text-blue-400 bg-blue-400/10",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    color: "text-[#c084fc] bg-[#c084fc]/10",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-neutral-500 bg-neutral-500/10",
  },
};

const statusFilters = [
  "all",
  "draft",
  "open",
  "in_progress",
  "completed",
  "cancelled",
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;

      const { data: company } = await supabase
        .from("employer_table")
        .select("id")
        .eq("user_id", data.user.id)
        .limit(1)
        .maybeSingle();

      if (!company) return;

      const { data: allProjects } = await supabase
        .from("project_table")
        .select("*")
        .eq("employer_id", company.id)
        .order("created_at", { ascending: false });

      if (allProjects) setProjects(allProjects);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setDeleting(projectId);
    const supabase = createClient();
    await supabase.from("project_table").delete().eq("id", projectId);
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    setDeleting(null);
  };

  const filtered = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-neutral-400 py-20">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Loading projects...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Projects</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Manage all your posted projects.
          </p>
        </div>
        <Link
          href="/employer_dashboard/projects/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#7B3FE4] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#7B3FE4]/90"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg bg-[#141418] py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 ring-1 ring-white/[0.06] outline-none transition-colors focus:ring-[#7B3FE4]/40"
          />
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                filter === s
                  ? "bg-[#7B3FE4]/10 text-[#c084fc]"
                  : "text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-200"
              }`}
            >
              {s === "all"
                ? "All"
                : s === "in_progress"
                  ? "In Progress"
                  : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl bg-[#141418] p-10 text-center ring-1 ring-white/[0.06]">
          <FolderKanban className="mx-auto h-10 w-10 text-neutral-600" />
          <p className="mt-4 text-sm text-neutral-400">
            {projects.length === 0
              ? "No projects yet. Create your first project to get started."
              : "No projects match your search."}
          </p>
          {projects.length === 0 && (
            <Link
              href="/employer_dashboard/projects/new"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#7B3FE4]/10 px-4 py-2 text-sm font-medium text-[#c084fc] transition-colors hover:bg-[#7B3FE4]/20"
            >
              <Plus className="h-4 w-4" />
              Create Project
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl ring-1 ring-white/[0.06]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06] bg-[#141418]">
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Project
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 hidden sm:table-cell">
                  Status
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500 hidden md:table-cell">
                  Budget
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500 hidden lg:table-cell">
                  Created
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500">
                  <ArrowUpDown className="h-3 w-3" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((project) => {
                const status =
                  statusConfig[project.status] || statusConfig.draft;
                return (
                  <tr
                    key={project.id}
                    className="bg-[#0E0E12] transition-colors hover:bg-[#141418]"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/employer_dashboard/projects/${project.id}`}
                        className="group"
                      >
                        <p className="text-sm font-medium text-white group-hover:text-[#c084fc] transition-colors">
                          {project.title}
                        </p>
                        {project.description && (
                          <p className="mt-0.5 max-w-md truncate text-xs text-neutral-500">
                            {project.description}
                          </p>
                        )}
                      </Link>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.color}`}
                      >
                        <status.icon className="h-3 w-3" />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right hidden md:table-cell">
                      <span className="text-sm text-neutral-300 tabular-nums">
                        {project.budget
                          ? `$${project.budget.toLocaleString()}`
                          : "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right hidden lg:table-cell">
                      <span className="text-xs text-neutral-500">
                        {new Date(project.created_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDelete(project.id)}
                        disabled={deleting === project.id}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                      >
                        {deleting === project.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
