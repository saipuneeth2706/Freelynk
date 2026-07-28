"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group";
import {
  ArrowLeft,
  Loader2,
  Save,
  Trash2,
  Clock,
  FolderOpen,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  budget: number | null;
  skills: string[];
  created_at: string;
  updated_at: string;
}

const statusOptions = [
  { label: "Draft", value: "draft" },
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const statusColors: Record<string, string> = {
  draft: "text-neutral-400 bg-neutral-400/10",
  open: "text-emerald-400 bg-emerald-400/10",
  in_progress: "text-blue-400 bg-blue-400/10",
  completed: "text-[#c084fc] bg-[#c084fc]/10",
  cancelled: "text-neutral-500 bg-neutral-500/10",
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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

      const { data: proj } = await supabase
        .from("project_table")
        .select("*")
        .eq("id", projectId)
        .eq("employer_id", company.id)
        .single();

      if (proj) setProject(proj);
      setLoading(false);
    });
  }, [projectId]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!project) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const budget = formData.get("budget") as string;
    const status = formData.get("status") as string;
    const skillsRaw = formData.get("skills") as string;

    const skills = skillsRaw
      ? skillsRaw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("project_table")
      .update({
        title,
        description: description || null,
        budget: budget ? parseFloat(budget) : null,
        status,
        skills,
      })
      .eq("id", project.id);

    if (updateError) {
      setError("Failed to save changes.");
      setSaving(false);
      return;
    }

    setProject({
      ...project,
      title,
      description: description || null,
      budget: budget ? parseFloat(budget) : null,
      status,
      skills,
    });
    setSuccess(true);
    setSaving(false);
    setTimeout(() => setSuccess(false), 2000);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("project_table").delete().eq("id", projectId);
    router.push("/employer_dashboard/projects");
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
          href="/employer_dashboard/projects"
          className="text-sm text-[#c084fc] hover:underline"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/employer_dashboard/projects"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-400 transition-colors hover:text-[#c084fc]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Projects
        </Link>
        <div className="mt-3 flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-white">{project.title}</h1>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[project.status] || statusColors.draft}`}
          >
            {project.status.replace("_", " ")}
          </span>
        </div>
        <p className="mt-1 text-sm text-neutral-500">
          Created{" "}
          {new Date(project.created_at).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="max-w-2xl rounded-xl bg-[#141418] p-6 ring-1 ring-white/[0.06]">
        <form onSubmit={handleSave}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title" className="text-neutral-200">
                Project Title
              </FieldLabel>
              <Input
                id="title"
                name="title"
                type="text"
                defaultValue={project.title}
                required
                className="bg-white/[0.04] text-white placeholder-neutral-500 ring-white/[0.08]"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="description" className="text-neutral-200">
                Description
              </FieldLabel>
              <div className="w-full">
                <InputGroup>
                  <InputGroupTextarea
                    name="description"
                    defaultValue={project.description || ""}
                    placeholder="Describe the project..."
                    className="min-h-[120px] bg-white/[0.04] text-white placeholder-neutral-500"
                  />
                </InputGroup>
              </div>
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="budget" className="text-neutral-200">
                  Budget ($)
                </FieldLabel>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  defaultValue={project.budget ?? ""}
                  min="0"
                  step="0.01"
                  className="bg-white/[0.04] text-white placeholder-neutral-500 ring-white/[0.08]"
                />
              </Field>

              <Field>
                <FieldLabel className="text-neutral-200">Status</FieldLabel>
                <Select
                  items={statusOptions}
                  name="status"
                  defaultValue={project.status}
                >
                  <SelectTrigger className="bg-white/[0.04] text-white ring-white/[0.08]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {statusOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="skills" className="text-neutral-200">
                Skills (comma separated)
              </FieldLabel>
              <Input
                id="skills"
                name="skills"
                type="text"
                defaultValue={project.skills?.join(", ") || ""}
                placeholder="e.g. React, TypeScript, Figma"
                className="bg-white/[0.04] text-white placeholder-neutral-500 ring-white/[0.08]"
              />
            </Field>

            {error && <p className="text-sm text-red-400">{error}</p>}
            {success && (
              <p className="text-sm text-emerald-400">Changes saved.</p>
            )}

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={handleDelete}
                disabled={deleting}
                className="text-red-400 hover:bg-red-500/10 hover:text-red-400 sm:w-auto"
              >
                {deleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                Delete
              </Button>
              <div className="flex gap-3">
                <Link
                  href="/employer_dashboard/projects"
                  className="inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-neutral-400 transition-colors hover:text-white"
                >
                  Cancel
                </Link>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-[#7B3FE4] text-white hover:bg-[#7B3FE4]/90"
                >
                  {saving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Changes
                </Button>
              </div>
            </div>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
