"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  FolderKanban,
  FolderOpen,
  Loader2,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  Pause,
  Users,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  status: string;
  budget: number | null;
  created_at: string;
}

interface Application {
  id: string;
  status: string;
  proposed_rate: number | null;
  created_at: string;
  freelancer: {
    full_name: string | null;
  } | null;
  project: {
    id: string;
    title: string;
  } | null;
}

const appStatusConfig: Record<
  string,
  { label: string; color: string }
> = {
  pending: { label: "Pending", color: "text-amber-400 bg-amber-400/10" },
  accepted: { label: "Accepted", color: "text-emerald-400 bg-emerald-400/10" },
  rejected: { label: "Rejected", color: "text-red-400 bg-red-400/10" },
  withdrawn: { label: "Withdrawn", color: "text-neutral-500 bg-neutral-500/10" },
};

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

export default function EmployerOverview() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
  });
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;

      const { data: company } = await supabase
        .from("employer_table")
        .select("id, company_name")
        .eq("user_id", data.user.id)
        .limit(1)
        .maybeSingle();

      if (!company) return;

      setCompanyName(company.company_name);

      const { data: allProjects } = await supabase
        .from("project_table")
        .select("id, title, status, budget, created_at")
        .eq("employer_id", company.id)
        .order("created_at", { ascending: false });

      if (allProjects) {
        setProjects(allProjects);
        setStats({
          total: allProjects.length,
          open: allProjects.filter((p) => p.status === "open").length,
          inProgress: allProjects.filter((p) => p.status === "in_progress")
            .length,
        });

        const projectIds = allProjects.map((p) => p.id);
        if (projectIds.length > 0) {
          const { data: apps } = await supabase
            .from("applications_table")
            .select(`
              id,
              status,
              proposed_rate,
              created_at,
              freelancer:freelancer_table (
                full_name
              ),
              project:project_table (
                id,
                title
              )
            `)
            .in("project_id", projectIds)
            .order("created_at", { ascending: false })
            .limit(5);

          if (apps) {
            setRecentApplications(
              (apps as unknown as any[]).map((a: any) => ({
                ...a,
                freelancer: Array.isArray(a.freelancer)
                  ? a.freelancer[0] || null
                  : a.freelancer || null,
                project: Array.isArray(a.project)
                  ? a.project[0] || null
                  : a.project || null,
              }))
            );
          }
        }
      }

      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-neutral-400 py-20">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Loading overview...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white" style={{ textWrap: "balance" }}>
          Welcome back{companyName ? `, ${companyName}` : ""}
        </h1>
        <p className="mt-1 text-sm text-neutral-400">
          Here&apos;s what&apos;s happening with your projects.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-[#141418] p-5 ring-1 ring-white/[0.06]">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-400">Total Projects</p>
            <FolderKanban className="h-4 w-4 text-neutral-500" />
          </div>
          <p className="mt-3 text-3xl font-semibold text-white tabular-nums">
            {stats.total}
          </p>
        </div>
        <div className="rounded-xl bg-[#141418] p-5 ring-1 ring-white/[0.06]">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-400">Open</p>
            <FolderOpen className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-3 text-3xl font-semibold text-emerald-400 tabular-nums">
            {stats.open}
          </p>
        </div>
        <div className="rounded-xl bg-[#141418] p-5 ring-1 ring-white/[0.06]">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-400">In Progress</p>
            <Loader2 className="h-4 w-4 text-blue-500" />
          </div>
          <p className="mt-3 text-3xl font-semibold text-blue-400 tabular-nums">
            {stats.inProgress}
          </p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            Recent Applications
          </h2>
        </div>

        {recentApplications.length === 0 ? (
          <div className="rounded-xl bg-[#141418] p-10 text-center ring-1 ring-white/[0.06]">
            <Users className="mx-auto h-10 w-10 text-neutral-600" />
            <p className="mt-4 text-sm text-neutral-400">
              No applications yet. Freelancers will appear here when they apply to your projects.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentApplications.map((app) => {
              const appStatus = appStatusConfig[app.status] || appStatusConfig.pending;
              return (
                <Link
                  key={app.id}
                  href={`/employer_dashboard/projects/${app.project?.id}`}
                  className="group flex items-center justify-between rounded-xl bg-[#141418] px-5 py-4 ring-1 ring-white/[0.06] transition-colors hover:bg-[#18181c]"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">
                      {app.freelancer?.full_name || "Unknown Freelancer"}
                      <span className="font-normal text-neutral-500"> applied to </span>
                      <span className="group-hover:text-[#c084fc] transition-colors">
                        {app.project?.title || "Untitled Project"}
                      </span>
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      {app.proposed_rate
                        ? `$${app.proposed_rate.toLocaleString()} bid`
                        : "No bid"}{" "}
                      &middot;{" "}
                      {new Date(app.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`ml-4 shrink-0 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${appStatus.color}`}
                  >
                    {appStatus.label}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Projects</h2>
          <Link
            href="/employer_dashboard/projects/new"
            className="inline-flex items-center gap-2 rounded-lg bg-[#7B3FE4] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#7B3FE4]/90"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-xl bg-[#141418] p-10 text-center ring-1 ring-white/[0.06]">
            <FolderKanban className="mx-auto h-10 w-10 text-neutral-600" />
            <p className="mt-4 text-sm text-neutral-400">
              No projects yet. Create your first project to get started.
            </p>
            <Link
              href="/employer_dashboard/projects/new"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#7B3FE4]/10 px-4 py-2 text-sm font-medium text-[#c084fc] transition-colors hover:bg-[#7B3FE4]/20"
            >
              <Plus className="h-4 w-4" />
              Create Project
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {projects.slice(0, 5).map((project) => {
              const status = statusConfig[project.status] || statusConfig.draft;
              return (
                <Link
                  key={project.id}
                  href={`/employer_dashboard/projects/${project.id}`}
                  className="group flex items-center justify-between rounded-xl bg-[#141418] px-5 py-4 ring-1 ring-white/[0.06] transition-colors hover:bg-[#18181c]"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white group-hover:text-[#c084fc] transition-colors">
                        {project.title}
                      </p>
                      <p className="mt-0.5 text-xs text-neutral-500">
                        {new Date(project.created_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.color}`}
                    >
                      <status.icon className="h-3 w-3" />
                      {status.label}
                    </span>
                    <ArrowRight className="h-4 w-4 text-neutral-600 transition-transform group-hover:translate-x-0.5 group-hover:text-[#c084fc]" />
                  </div>
                </Link>
              );
            })}
            {projects.length > 5 && (
              <Link
                href="/employer_dashboard/projects"
                className="block text-center text-sm text-neutral-500 transition-colors hover:text-[#c084fc]"
              >
                View all {projects.length} projects
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
