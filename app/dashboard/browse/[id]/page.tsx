"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group";
import {
  ArrowLeft,
  Loader2,
  Send,
  CheckCircle2,
  Briefcase,
  DollarSign,
  Building2,
  Calendar,
  AlertCircle,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string | null;
  budget: number | null;
  skills: string[];
  status: string;
  created_at: string;
  employer: {
    company_name: string;
    company_desc: string | null;
  } | null;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [freelancerId, setFreelancerId] = useState<string | null>(null);
  const [profileChecked, setProfileChecked] = useState(false);

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

      if (freelancer) {
        setFreelancerId(freelancer.id);

        const { data: existingApp } = await supabase
          .from("applications_table")
          .select("id")
          .eq("freelancer_id", freelancer.id)
          .eq("project_id", projectId)
          .limit(1)
          .maybeSingle();

        if (existingApp) setApplied(true);
      }

      setProfileChecked(true);
    });

    supabase
      .from("project_table")
      .select(`
        *,
        employer:employer_table (
          company_name,
          company_desc
        )
      `)
      .eq("id", projectId)
      .single()
      .then(({ data }) => {
        if (data) {
          const raw = data as any;
          setProject({
            ...raw,
            employer: Array.isArray(raw.employer)
              ? raw.employer[0] || null
              : raw.employer || null,
          });
        }
        setLoading(false);
      });
  }, [projectId]);

  const handleApply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!freelancerId) {
      setError("No freelancer profile found. Please set up your profile first.");
      return;
    }

    setApplying(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const coverLetter = formData.get("cover_letter") as string;
    const proposedRate = formData.get("proposed_rate") as string;

    const supabase = createClient();
    const { error: insertError } = await supabase
      .from("applications_table")
      .insert({
        project_id: projectId,
        freelancer_id: freelancerId,
        cover_letter: coverLetter || null,
        proposed_rate: proposedRate ? parseFloat(proposedRate) : null,
      });

    if (insertError) {
      if (insertError.code === "23505") {
        setError("You have already applied to this project.");
      } else {
        setError(
          insertError.message || "Failed to submit application. Please try again."
        );
      }
      setApplying(false);
      return;
    }

    setApplied(true);
    setApplying(false);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-neutral-400 py-20">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Loading project...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="space-y-4 py-20 text-center">
        <p className="text-sm text-neutral-400">Project not found.</p>
        <Link
          href="/dashboard/browse"
          className="text-sm text-[#38bdf8] hover:underline"
        >
          Back to Browse
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/browse"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-400 transition-colors hover:text-[#38bdf8]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Browse
      </Link>

      <div className="space-y-6 lg:grid lg:grid-cols-3 lg:gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              {project.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-neutral-400">
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" />
                {project.employer?.company_name || "Unknown"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(project.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              {project.budget && (
                <span className="inline-flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5" />
                  ${project.budget.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {project.description && (
            <div className="rounded-xl bg-[#141418] p-6 ring-1 ring-white/[0.06]">
              <h2 className="text-sm font-medium text-neutral-300">
                Description
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-400 whitespace-pre-wrap">
                {project.description}
              </p>
            </div>
          )}

          {project.skills && project.skills.length > 0 && (
            <div className="rounded-xl bg-[#141418] p-6 ring-1 ring-white/[0.06]">
              <h2 className="text-sm font-medium text-neutral-300">
                Required Skills
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-neutral-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-10 rounded-xl bg-[#141418] p-6 ring-1 ring-white/[0.06]">
            {applied ? (
              <div className="text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400" />
                <p className="mt-3 text-sm font-medium text-white">
                  Already Applied
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  You&apos;ve already submitted an application for this project.
                </p>
                <Link
                  href="/dashboard/applications"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/[0.04] px-4 py-2 text-sm font-medium text-neutral-300 transition-colors hover:bg-white/[0.08]"
                >
                  View My Applications
                </Link>
              </div>
            ) : !profileChecked ? (
              <div className="text-center">
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-neutral-500" />
                <p className="mt-2 text-xs text-neutral-500">Checking profile...</p>
              </div>
            ) : !freelancerId ? (
              <div className="text-center">
                <AlertCircle className="mx-auto h-10 w-10 text-amber-400" />
                <p className="mt-3 text-sm font-medium text-white">
                  Profile Required
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  Please set up your freelancer profile before applying.
                </p>
                <Link
                  href="/dashboard/profile"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#0A29FF]/10 px-4 py-2 text-sm font-medium text-[#38bdf8] transition-colors hover:bg-[#0A29FF]/20"
                >
                  Set Up Profile
                </Link>
              </div>
            ) : (
              <>
                <h2 className="text-sm font-medium text-neutral-300">
                  Apply to this project
                </h2>
                <form onSubmit={handleApply} className="mt-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel
                        htmlFor="cover_letter"
                        className="text-neutral-200"
                      >
                        Cover Letter
                      </FieldLabel>
                      <div className="w-full">
                        <InputGroup>
                          <InputGroupTextarea
                            name="cover_letter"
                            placeholder="Why are you a good fit for this project?"
                            className="min-h-[120px] bg-white/[0.04] text-white placeholder-neutral-500"
                          />
                        </InputGroup>
                      </div>
                    </Field>

                    <Field>
                      <FieldLabel
                        htmlFor="proposed_rate"
                        className="text-neutral-200"
                      >
                        Proposed Rate ($)
                      </FieldLabel>
                      <Input
                        id="proposed_rate"
                        name="proposed_rate"
                        type="number"
                        placeholder="Your bid amount"
                        min="0"
                        step="0.01"
                        className="bg-white/[0.04] text-white placeholder-neutral-500 ring-white/[0.08]"
                      />
                    </Field>

                    {error && <p className="text-sm text-red-400">{error}</p>}

                    <Button
                      type="submit"
                      disabled={applying || !freelancerId}
                      className="w-full bg-[#0A29FF] text-white hover:bg-[#0A29FF]/90"
                    >
                      {applying ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="mr-2 h-4 w-4" />
                      )}
                      Submit Application
                    </Button>
                  </FieldGroup>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
