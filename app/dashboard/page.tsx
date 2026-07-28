"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  Loader2,
  Briefcase,
} from "lucide-react";

interface Application {
  id: string;
  status: string;
  created_at: string;
  project: {
    title: string;
    employer: {
      company_name: string;
    } | null;
  } | null;
}

interface Project {
  id: string;
  title: string;
  status: string;
  budget: number | null;
  created_at: string;
  employer: {
    company_name: string;
  } | null;
}

const statusColors: Record<string, string> = {
  pending: "text-amber-400 bg-amber-400/10",
  accepted: "text-emerald-400 bg-emerald-400/10",
  rejected: "text-red-400 bg-red-400/10",
  withdrawn: "text-neutral-500 bg-neutral-500/10",
};

export default function FreelancerOverview() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [suggestedProjects, setSuggestedProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
  });
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;

      const { data: profile } = await supabase
        .from("user_table")
        .select("full_name")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (profile) setFullName(profile.full_name);

      const { data: freelancer } = await supabase
        .from("freelancer_table")
        .select("id")
        .eq("user_id", data.user.id)
        .limit(1)
        .maybeSingle();

      if (freelancer) {
        const { data: apps } = await supabase
          .from("applications_table")
          .select(`
            id,
            status,
            created_at,
            project:project_table (
              title,
              employer:employer_table (
                company_name
              )
            )
          `)
          .eq("freelancer_id", freelancer.id)
          .order("created_at", { ascending: false });

        if (apps) {
          const normalized = (apps as unknown as any[]).map((a: any) => ({
            ...a,
            project: Array.isArray(a.project)
              ? {
                  ...a.project[0],
                  employer: Array.isArray(a.project[0]?.employer)
                    ? a.project[0].employer[0] || null
                    : a.project[0]?.employer || null,
                }
              : a.project,
          }));
          setApplications(normalized);
          setStats({
            total: normalized.length,
            pending: normalized.filter((a: any) => a.status === "pending").length,
            accepted: normalized.filter((a: any) => a.status === "accepted").length,
          });
        }
      }

      const { data: openProjects } = await supabase
        .from("project_table")
        .select(`
          id,
          title,
          status,
          budget,
          created_at,
          employer:employer_table (
            company_name
          )
        `)
        .eq("status", "open")
        .order("created_at", { ascending: false })
        .limit(5);

      if (openProjects) {
        setSuggestedProjects(
          (openProjects as unknown as any[]).map((p: any) => ({
            ...p,
            employer: Array.isArray(p.employer)
              ? p.employer[0] || null
              : p.employer || null,
          }))
        );
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
        <h1
          className="text-2xl font-semibold text-white"
          style={{ textWrap: "balance" }}
        >
          Welcome back{fullName ? `, ${fullName.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-1 text-sm text-neutral-400">
          Here&apos;s your activity at a glance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-[#141418] p-5 ring-1 ring-white/[0.06]">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-400">Applications</p>
            <FileText className="h-4 w-4 text-neutral-500" />
          </div>
          <p className="mt-3 text-3xl font-semibold text-white tabular-nums">
            {stats.total}
          </p>
        </div>
        <div className="rounded-xl bg-[#141418] p-5 ring-1 ring-white/[0.06]">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-400">Pending</p>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-3 text-3xl font-semibold text-amber-400 tabular-nums">
            {stats.pending}
          </p>
        </div>
        <div className="rounded-xl bg-[#141418] p-5 ring-1 ring-white/[0.06]">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-400">Accepted</p>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-3 text-3xl font-semibold text-emerald-400 tabular-nums">
            {stats.accepted}
          </p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            Recent Applications
          </h2>
          <Link
            href="/dashboard/applications"
            className="text-sm text-neutral-500 transition-colors hover:text-[#38bdf8]"
          >
            View all
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="rounded-xl bg-[#141418] p-10 text-center ring-1 ring-white/[0.06]">
            <FileText className="mx-auto h-10 w-10 text-neutral-600" />
            <p className="mt-4 text-sm text-neutral-400">
              No applications yet. Browse open projects to get started.
            </p>
            <Link
              href="/dashboard/browse"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#0A29FF]/10 px-4 py-2 text-sm font-medium text-[#38bdf8] transition-colors hover:bg-[#0A29FF]/20"
            >
              <Search className="h-4 w-4" />
              Browse Projects
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {applications.slice(0, 5).map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between rounded-xl bg-[#141418] px-5 py-4 ring-1 ring-white/[0.06]"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {app.project?.title || "Untitled Project"}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {app.project?.employer?.company_name || "Unknown company"}{" "}
                    &middot;{" "}
                    {new Date(app.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <span
                  className={`ml-4 shrink-0 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[app.status] || statusColors.pending}`}
                >
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            Open Projects
          </h2>
          <Link
            href="/dashboard/browse"
            className="text-sm text-neutral-500 transition-colors hover:text-[#38bdf8]"
          >
            View all
          </Link>
        </div>

        {suggestedProjects.length === 0 ? (
          <div className="rounded-xl bg-[#141418] p-10 text-center ring-1 ring-white/[0.06]">
            <Briefcase className="mx-auto h-10 w-10 text-neutral-600" />
            <p className="mt-4 text-sm text-neutral-400">
              No open projects available right now. Check back later.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {suggestedProjects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/browse/${project.id}`}
                className="group flex items-center justify-between rounded-xl bg-[#141418] px-5 py-4 ring-1 ring-white/[0.06] transition-colors hover:bg-[#18181c]"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white group-hover:text-[#38bdf8] transition-colors">
                    {project.title}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {project.employer?.company_name || "Unknown"}{" "}
                    {project.budget
                      ? ` \u00b7 $${project.budget.toLocaleString()}`
                      : ""}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-neutral-600 transition-transform group-hover:translate-x-0.5 group-hover:text-[#38bdf8]" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
