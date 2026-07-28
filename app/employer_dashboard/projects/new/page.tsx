"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import {
  InputGroup,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

const statusOptions = [
  { label: "Draft", value: "draft" },
  { label: "Open", value: "open" },
];

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [employerId, setEmployerId] = useState<number | null>(null);

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
      if (company) setEmployerId(company.id);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!employerId) return;

    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const budget = formData.get("budget") as string;
    const status = formData.get("status") as string;
    const skillsRaw = formData.get("skills") as string;

    if (!title) {
      setError("Project title is required.");
      setLoading(false);
      return;
    }

    const skills = skillsRaw
      ? skillsRaw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const supabase = createClient();
    const { error: insertError } = await supabase
      .from("project_table")
      .insert({
        employer_id: employerId,
        title,
        description: description || null,
        budget: budget ? parseFloat(budget) : null,
        status: status || "draft",
        skills,
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      setError("Failed to create project. Please try again.");
      setLoading(false);
      return;
    }

    router.push("/employer_dashboard/projects");
  };

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
        <h1 className="mt-3 text-2xl font-semibold text-white">
          Create Project
        </h1>
        <p className="mt-1 text-sm text-neutral-400">
          Fill in the details to post a new project.
        </p>
      </div>

      <div className="max-w-2xl rounded-xl bg-[#141418] p-6 ring-1 ring-white/[0.06]">
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title" className="text-neutral-200">
                Project Title
              </FieldLabel>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="e.g. Mobile App Redesign"
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
                    placeholder="Describe the project scope, requirements, and deliverables..."
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
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="bg-white/[0.04] text-white placeholder-neutral-500 ring-white/[0.08]"
                />
              </Field>

              <Field>
                <FieldLabel className="text-neutral-200">Status</FieldLabel>
                <Select items={statusOptions} name="status" defaultValue="draft">
                  <SelectTrigger className="bg-white/[0.04] text-white ring-white/[0.08]">
                    <SelectValue placeholder="Select status" />
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
                placeholder="e.g. React, TypeScript, Figma"
                className="bg-white/[0.04] text-white placeholder-neutral-500 ring-white/[0.08]"
              />
            </Field>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <Link
                href="/employer_dashboard/projects"
                className="inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-neutral-400 transition-colors hover:text-white"
              >
                Cancel
              </Link>
              <Button
                type="submit"
                disabled={loading || !employerId}
                className="bg-[#7B3FE4] text-white hover:bg-[#7B3FE4]/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Project"
                )}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
