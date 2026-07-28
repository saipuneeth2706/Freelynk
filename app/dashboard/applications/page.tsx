"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  FileText,
  Search,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";

interface Application {
  id: string;
  status: string;
  cover_letter: string | null;
  proposed_rate: number | null;
  created_at: string;
  project: {
    id: string;
    title: string;
    budget: number | null;
    employer: {
      company_name: string;
    } | null;
  } | null;
}

const statusConfig: Record<
  string,
  { label: string; icon: typeof Clock; color: string }
> = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-amber-400 bg-amber-400/10",
  },
  accepted: {
    label: "Accepted",
    icon: CheckCircle2,
    color: "text-emerald-400 bg-emerald-400/10",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    color: "text-red-400 bg-red-400/10",
  },
  withdrawn: {
    label: "Withdrawn",
    icon: XCircle,
    color: "text-neutral-500 bg-neutral-500/10",
  },
};

const statusFilters = ["all", "pending", "accepted", "rejected", "withdrawn"];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [withdrawing, setWithdrawing] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;

      const { data: freelancer } = await supabase
        .from("freelancer_table")
        .select("id")
        .eq("user_id", data.user.id)
        .limit(1)
        .maybeSingle();

      if (!freelancer) {
        setLoading(false);
        return;
      }

      const { data: apps } = await supabase
        .from("applications_table")
        .select(`
          id,
          status,
          cover_letter,
          proposed_rate,
          created_at,
          project:project_table (
            id,
            title,
            budget,
            employer:employer_table (
              company_name
            )
          )
        `)
        .eq("freelancer_id", freelancer.id)
        .order("created_at", { ascending: false });

      if (apps) {
        setApplications(
          (apps as unknown as Application[]).map((app) => ({
            ...app,
            project: Array.isArray(app.project)
              ? app.project[0] || null
              : app.project,
          }))
        );
      }
      setLoading(false);
    });
  }, []);

  const handleWithdraw = async (applicationId: string) => {
    setWithdrawing(applicationId);
    const supabase = createClient();
    await supabase
      .from("applications_table")
      .update({ status: "withdrawn" })
      .eq("id", applicationId);
    setApplications((prev) =>
      prev.map((a) =>
        a.id === applicationId ? { ...a, status: "withdrawn" } : a
      )
    );
    setWithdrawing(null);
  };

  const filtered = applications.filter((a) => {
    const q = search.toLowerCase();
    const matchesSearch =
      a.project?.title?.toLowerCase().includes(q) ||
      a.project?.employer?.company_name?.toLowerCase().includes(q);
    const matchesFilter = filter === "all" || a.status === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-neutral-400 py-20">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Loading applications...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">My Applications</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Track all your project applications.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by project or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg bg-[#141418] py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 ring-1 ring-white/[0.06] outline-none transition-colors focus:ring-[#0A29FF]/40"
          />
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                filter === s
                  ? "bg-[#0A29FF]/10 text-[#38bdf8]"
                  : "text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-200"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl bg-[#141418] p-10 text-center ring-1 ring-white/[0.06]">
          <FileText className="mx-auto h-10 w-10 text-neutral-600" />
          <p className="mt-4 text-sm text-neutral-400">
            {applications.length === 0
              ? "No applications yet. Browse open projects to apply."
              : "No applications match your search."}
          </p>
          {applications.length === 0 && (
            <Link
              href="/dashboard/browse"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#0A29FF]/10 px-4 py-2 text-sm font-medium text-[#38bdf8] transition-colors hover:bg-[#0A29FF]/20"
            >
              <Search className="h-4 w-4" />
              Browse Projects
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => {
            const status =
              statusConfig[app.status] || statusConfig.pending;
            return (
              <div
                key={app.id}
                className="rounded-xl bg-[#141418] p-5 ring-1 ring-white/[0.06]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/dashboard/browse/${app.project?.id}`}
                        className="text-sm font-semibold text-white hover:text-[#38bdf8] transition-colors"
                      >
                        {app.project?.title || "Untitled Project"}
                      </Link>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.color}`}
                      >
                        <status.icon className="h-3 w-3" />
                        {status.label}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-neutral-500">
                      {app.project?.employer?.company_name || "Unknown"}{" "}
                      {app.proposed_rate
                        ? ` \u00b7 $${app.proposed_rate.toLocaleString()} bid`
                        : ""}{" "}
                      &middot;{" "}
                      {new Date(app.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    {app.cover_letter && (
                      <p className="mt-2 line-clamp-2 text-sm text-neutral-400">
                        {app.cover_letter}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {app.status === "pending" && (
                      <button
                        onClick={() => handleWithdraw(app.id)}
                        disabled={withdrawing === app.id}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-400 transition-colors hover:bg-white/[0.04] hover:text-neutral-200 disabled:opacity-50"
                      >
                        {withdrawing === app.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          "Withdraw"
                        )}
                      </button>
                    )}
                    {app.project?.id && (
                      <Link
                        href={`/dashboard/browse/${app.project.id}`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-white/[0.04] hover:text-[#38bdf8]"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
