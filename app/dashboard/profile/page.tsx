"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group";
import { Loader2, Save, Plus, X } from "lucide-react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [freelancerId, setFreelancerId] = useState<string | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const [profile, setProfile] = useState({
    bio: "",
    hourly_rate: "",
    portfolio_url: "",
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;

      const { data: freelancer } = await supabase
        .from("freelancer_table")
        .select("id, bio, skills, hourly_rate, portfolio_url")
        .eq("user_id", data.user.id)
        .limit(1)
        .maybeSingle();

      if (freelancer) {
        setFreelancerId(freelancer.id);
        setProfile({
          bio: freelancer.bio || "",
          hourly_rate: freelancer.hourly_rate?.toString() || "",
          portfolio_url: freelancer.portfolio_url || "",
        });
        setSkills(freelancer.skills || []);
      }
      setLoading(false);
    });
  }, []);

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();

    if (!freelancerId) {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setError("Not authenticated.");
        setSaving(false);
        return;
      }

      const { data: newFreelancer, error: insertError } = await supabase
        .from("freelancer_table")
        .insert({
          user_id: userData.user.id,
          bio: profile.bio || null,
          skills,
          hourly_rate: profile.hourly_rate
            ? parseFloat(profile.hourly_rate)
            : null,
          portfolio_url: profile.portfolio_url || null,
        })
        .select("id")
        .single();

      if (insertError) {
        setError("Failed to create profile.");
        setSaving(false);
        return;
      }

      setFreelancerId(newFreelancer.id);
    } else {
      const { error: updateError } = await supabase
        .from("freelancer_table")
        .update({
          bio: profile.bio || null,
          skills,
          hourly_rate: profile.hourly_rate
            ? parseFloat(profile.hourly_rate)
            : null,
          portfolio_url: profile.portfolio_url || null,
        })
        .eq("id", freelancerId);

      if (updateError) {
        setError("Failed to save profile.");
        setSaving(false);
        return;
      }
    }

    setSuccess(true);
    setSaving(false);
    setTimeout(() => setSuccess(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-neutral-400 py-20">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Profile</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Manage your freelancer profile and skills.
        </p>
      </div>

      <div className="max-w-2xl rounded-xl bg-[#141418] p-6 ring-1 ring-white/[0.06]">
        <form onSubmit={handleSave}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="bio" className="text-neutral-200">
                Bio
              </FieldLabel>
              <div className="w-full">
                <InputGroup>
                  <InputGroupTextarea
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                    placeholder="Tell employers about yourself, your experience, and what you do..."
                    className="min-h-[120px] bg-white/[0.04] text-white placeholder-neutral-500"
                  />
                </InputGroup>
              </div>
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel
                  htmlFor="hourly_rate"
                  className="text-neutral-200"
                >
                  Hourly Rate ($)
                </FieldLabel>
                <Input
                  id="hourly_rate"
                  type="number"
                  value={profile.hourly_rate}
                  onChange={(e) =>
                    setProfile({ ...profile, hourly_rate: e.target.value })
                  }
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="bg-white/[0.04] text-white placeholder-neutral-500 ring-white/[0.08]"
                />
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="portfolio_url"
                  className="text-neutral-200"
                >
                  Portfolio URL
                </FieldLabel>
                <Input
                  id="portfolio_url"
                  type="url"
                  value={profile.portfolio_url}
                  onChange={(e) =>
                    setProfile({ ...profile, portfolio_url: e.target.value })
                  }
                  placeholder="https://yoursite.com"
                  className="bg-white/[0.04] text-white placeholder-neutral-500 ring-white/[0.08]"
                />
              </Field>
            </div>

            <Field>
              <FieldLabel className="text-neutral-200">Skills</FieldLabel>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="Type a skill and press Enter"
                  className="bg-white/[0.04] text-white placeholder-neutral-500 ring-white/[0.08]"
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={addSkill}
                  className="shrink-0 text-neutral-400 hover:text-[#38bdf8]"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-neutral-300"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-neutral-500 hover:text-red-400"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </Field>

            {error && <p className="text-sm text-red-400">{error}</p>}
            {success && (
              <p className="text-sm text-emerald-400">Profile saved.</p>
            )}

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={saving}
                className="bg-[#0A29FF] text-white hover:bg-[#0A29FF]/90"
              >
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Profile
              </Button>
            </div>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
