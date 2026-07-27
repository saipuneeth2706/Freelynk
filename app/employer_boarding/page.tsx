"use client";

import { useState, useEffect } from "react";
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
  InputGroupTextarea,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "@/components/ui/input-group";
import BorderGlow from "@/components/ui/BorderGlow";
import CursorGrid from "@/components/CursorGrid";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const companySizes = [
  { label: "1 - 10", value: "1" },
  { label: "10 - 500", value: "10" },
  { label: "500 - 1000", value: "500" },
  { label: "1000+", value: "1000" },
];

export default function InputForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const companyName = formData.get("company-name") as string;
    const companyDesc = formData.get("company-description") as string;
    const companySize = formData.get("company-size") as string;

    if (!userId) {
      setError("You must be logged in to continue.");
      setLoading(false);
      return;
    }

    if (!companyName || !companySize) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const supabase = createClient();

    // Check if company name already exists
    const { data: existingCompany } = await supabase
      .from("employer_table")
      .select("id")
      .eq("company_name", companyName)
      .single();

    if (existingCompany) {
      setError("A company with this name already exists.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase
      .from("employer_table")
      .insert({
        user_id: userId,
        company_name: companyName,
        company_desc: companyDesc || null,
        company_size: parseInt(companySize, 10),
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      if (insertError.code === "23505") {
        setError("A company with this name already exists.");
      } else {
        setError("Something went wrong. Please try again.");
      }
      setLoading(false);
      return;
    }

    router.push("/employer_dashboard");
  };

  return (
    <div className="dark relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#0B0B0F] px-6 py-12">
      <div className="fixed inset-0 z-0 bg-[#0B0B0F]">
        <CursorGrid
          cellSize={30}
          color="#7B3FE4"
          radius={200}
          falloff="smooth"
          holdTime={600}
          fadeDuration={800}
          lineWidth={0.5}
          maxOpacity={0.5}
          fillOpacity={0}
          gridOpacity={0.1}
          cellRadius={2}
          clickPulse={true}
        />
      </div>

      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/3 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, #7B3FE4 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full opacity-[0.03]"
          style={{
            background: "radial-gradient(circle, #c084fc 0%, transparent 60%)",
          }}
        />
      </div>

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#7B3FE4]/10 text-[#c084fc] ring-1 ring-[#7B3FE4]/20">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              className="h-8 w-8"
              aria-hidden="true"
            >
              <rect
                x="6"
                y="14"
                width="36"
                height="28"
                rx="4"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M16 14V10a8 8 0 0 1 16 0v4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle
                cx="24"
                cy="28"
                r="4"
                fill="currentColor"
                opacity="0.15"
              />
              <path
                d="M24 26v4M22 28h4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="flex flex-col gap-2">
            <h1
              className="text-3xl font-semibold tracking-tight text-white sm:text-4xl"
              style={{ textWrap: "balance" }}
            >
              Set Up Your Company
            </h1>
            <p className="max-w-sm text-[15px] leading-relaxed text-neutral-400">
              Tell us about your company to get started with hiring talent.
            </p>
          </div>
        </div>

        <BorderGlow
          animated={true}
          backgroundColor="#120F17"
          borderRadius={20}
          glowColor="270 70 60"
          glowRadius={80}
          glowIntensity={3}
          edgeSensitivity={0}
          coneSpread={35}
          colors={["#7B3FE4", "#c084fc", "#a855f7"]}
          fillOpacity={0.4}
          className="w-full"
        >
          <form onSubmit={handleSubmit} className="w-full px-8 py-8">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="form-name" className="text-white">
                  Company&apos;s Name
                </FieldLabel>
                <Input
                  id="form-name"
                  name="company-name"
                  type="text"
                  placeholder="Evil Rabbit"
                  required
                  className="text-white"
                />
              </Field>

              <div className="flex flex-col gap-2 text-white">
                <FieldLabel htmlFor="form-description">
                  Company&apos;s Description
                </FieldLabel>
                <div className="w-full">
                  <InputGroup>
                    <InputGroupTextarea
                      name="company-description"
                      placeholder="Enter about your company"
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="text-xs text-neutral-500" />
                    </InputGroupAddon>
                  </InputGroup>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field className="text-white">
                  <FieldLabel htmlFor="form-size" className="text-white">
                    Company Size
                  </FieldLabel>
                  <Select items={companySizes} name="company-size">
                    <SelectTrigger id="form-size">
                      <SelectValue placeholder="Select size" />
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
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full sm:w-auto text-white"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#7B3FE4] text-white hover:bg-[#7B3FE4]/90 sm:w-auto"
                >
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </BorderGlow>

        <p className="text-center text-xs text-neutral-600">
          You can update these details later in your company settings.
        </p>
      </div>
    </div>
  );
}
