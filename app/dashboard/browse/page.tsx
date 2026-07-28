"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Search, Loader2, Briefcase, ArrowRight } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string | null;
  budget: number | null;
  skills: string[];
  created_at: string;
  employer: {
    company_name: string;
  } | null;
}

export default function BrowseProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("project_table")
      .select(`
        id,
        title,
        description,
        budget,
        skills,
        created_at,
        employer:employer_table (
          company_name
        )
      `)
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data)
          setProjects(
            (data as unknown as (Omit<Project, "employer"> & { employer: { company_name: string }[] })[]).map(
              (p) => ({ ...p, employer: p.employer?.[0] || null })
            )
          );
        setLoading(false);
      });
  }, []);

  const filtered = projects.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.employer?.company_name?.toLowerCase().includes(q) ||
      p.skills?.some((s) => s.toLowerCase().includes(q))
    );
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
      <div>
        <h1 className="text-2xl font-semibold text-white">Browse Projects</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Find open projects that match your skills.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
        <input
          type="text"
          placeholder="Search by title, skill, or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg bg-[#141418] py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 ring-1 ring-white/[0.06] outline-none transition-colors focus:ring-[#0A29FF]/40"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl bg-[#141418] p-10 text-center ring-1 ring-white/[0.06]">
          <Briefcase className="mx-auto h-10 w-10 text-neutral-600" />
          <p className="mt-4 text-sm text-neutral-400">
            {projects.length === 0
              ? "No open projects available right now."
              : "No projects match your search."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/browse/${project.id}`}
              className="group block rounded-xl bg-[#141418] p-5 ring-1 ring-white/[0.06] transition-colors hover:bg-[#18181c]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-semibold text-white group-hover:text-[#38bdf8] transition-colors">
                      {project.title}
                    </h3>
                    {project.budget && (
                      <span className="shrink-0 rounded-full bg-[#0A29FF]/10 px-2.5 py-0.5 text-xs font-medium text-[#38bdf8]">
                        ${project.budget.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">
                    {project.employer?.company_name || "Unknown company"}{" "}
                    &middot;{" "}
                    {new Date(project.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  {project.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-neutral-400">
                      {project.description}
                    </p>
                  )}
                  {project.skills && project.skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md bg-white/[0.04] px-2 py-0.5 text-xs text-neutral-400"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-neutral-600 transition-transform group-hover:translate-x-0.5 group-hover:text-[#38bdf8]" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
