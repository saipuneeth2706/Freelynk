"use client";

import { useState, useEffect } from "react";
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
import { Loader2, Save, Building2 } from "lucide-react";

const companySizes = [
  { label: "1 - 10", value: "1" },
  { label: "10 - 500", value: "10" },
  { label: "500 - 1000", value: "500" },
  { label: "1000+", value: "1000" },
];

export default function CompanyProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [company, setCompany] = useState<{
    id: number;
    company_name: string;
    company_desc: string | null;
    company_size: number;
  } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: companyData } = await supabase
        .from("employer_table")
        .select("id, company_name, company_desc, company_size")
        .eq("user_id", data.user.id)
        .limit(1)
        .maybeSingle();
      if (companyData) setCompany(companyData);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!company) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const companyName = formData.get("company_name") as string;
    const companyDesc = formData.get("company_desc") as string;
    const companySize = formData.get("company_size") as string;

    if (!companyName) {
      setError("Company name is required.");
      setSaving(false);
      return;
    }

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("employer_table")
      .update({
        company_name: companyName,
        company_desc: companyDesc || null,
        company_size: parseInt(companySize, 10),
      })
      .eq("id", company.id);

    if (updateError) {
      if (updateError.code === "23505") {
        setError("A company with this name already exists.");
      } else {
        setError("Failed to save changes.");
      }
      setSaving(false);
      return;
    }

    setCompany({
      ...company,
      company_name: companyName,
      company_desc: companyDesc || null,
      company_size: parseInt(companySize, 10),
    });
    setSuccess(true);
    setSaving(false);
    setTimeout(() => setSuccess(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-neutral-400 py-20">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Loading company profile...</span>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="space-y-4 py-20 text-center">
        <Building2 className="mx-auto h-10 w-10 text-neutral-600" />
        <p className="text-sm text-neutral-400">
          No company profile found. Please complete onboarding first.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Company Profile</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Manage your company information.
        </p>
      </div>

      <div className="max-w-2xl rounded-xl bg-[#141418] p-6 ring-1 ring-white/[0.06]">
        <form onSubmit={handleSave}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="company_name" className="text-neutral-200">
                Company Name
              </FieldLabel>
              <Input
                id="company_name"
                name="company_name"
                type="text"
                defaultValue={company.company_name}
                required
                className="bg-white/[0.04] text-white placeholder-neutral-500 ring-white/[0.08]"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="company_desc" className="text-neutral-200">
                Description
              </FieldLabel>
              <div className="w-full">
                <InputGroup>
                  <InputGroupTextarea
                    name="company_desc"
                    defaultValue={company.company_desc || ""}
                    placeholder="Tell people about your company..."
                    className="min-h-[120px] bg-white/[0.04] text-white placeholder-neutral-500"
                  />
                </InputGroup>
              </div>
            </Field>

            <Field>
              <FieldLabel className="text-neutral-200">Company Size</FieldLabel>
              <Select
                items={companySizes}
                name="company_size"
                defaultValue={String(company.company_size)}
              >
                <SelectTrigger className="bg-white/[0.04] text-white ring-white/[0.08]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {companySizes.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            {error && <p className="text-sm text-red-400">{error}</p>}
            {success && (
              <p className="text-sm text-emerald-400">Profile updated.</p>
            )}

            <div className="flex justify-end pt-2">
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
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
