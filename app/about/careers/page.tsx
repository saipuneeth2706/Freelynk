"use client";

import { useState, useRef } from "react";
import CardNav from "@/components/CardNav";
import CursorGrid from "@/components/CursorGrid";
import Stepper, { Step } from "@/components/Stepper";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  {
    label: "About",
    bgColor: "#1B1722",
    textColor: "#fff",
    links: [
      { label: "Company", href: "/about/company", ariaLabel: "About Company" },
      { label: "Careers", href: "/about/careers", ariaLabel: "About Careers" },
    ],
  },
  {
    label: "Projects",
    bgColor: "#2F293A",
    textColor: "#fff",
    links: [
      {
        label: "Featured",
        href: "/projects/featured",
        ariaLabel: "Featured Projects",
      },
      {
        label: "Case Studies",
        href: "/projects/case-studies",
        ariaLabel: "Project Case Studies",
      },
    ],
  },
  {
    label: "Contact",
    bgColor: "#2F293A",
    textColor: "#fff",
    links: [
      {
        label: "Email",
        href: "mailto:hello@freelynk.com",
        ariaLabel: "Email us",
      },
      {
        label: "Twitter",
        href: "https://twitter.com/freelynk",
        ariaLabel: "Twitter",
      },
      {
        label: "LinkedIn",
        href: "https://linkedin.com/company/freelynk",
        ariaLabel: "LinkedIn",
      },
    ],
  },
];

export default function CareersPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleEmailBlur = () => {
    if (email && !isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError(null);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (emailError && isValidEmail(value)) {
      setEmailError(null);
    }
  };

  const validateAndSetFile = (file: File | null) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setFileError("Only PDF files are accepted. Please upload a PDF document.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setFileError("File too large. Maximum size is 10 MB.");
      return;
    }
    setFileError(null);
    setResumeFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    validateAndSetFile(file);
    if (e.target) e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] ?? null;
    validateAndSetFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-[#0B0B0F] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="pointer-events-none fixed inset-0 z-0">
        <CursorGrid
          cellSize={30}
          color="#0A29FF"
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

      <div className="relative z-10 flex h-screen flex-col overflow-hidden">
        <CardNav
          logo="/logo.svg"
          logoAlt="FreeLynk Logo"
          logoText="FreeLynk"
          items={navItems}
          baseColor="#111"
          menuColor="#fff"
          buttonBgColor="#fff"
          buttonTextColor="#111"
          ease="power3.out"
        />

        <main className="flex flex-1 flex-col items-center justify-center px-6 pb-8 pt-24">
          <div className="mx-auto w-full max-w-2xl text-center">
            <h1
              className="mb-3 font-[family-name:var(--font-google-sans)] text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[1.1] tracking-[-0.03em] text-[#fafafa]"
              style={{ textWrap: "balance" }}
            >
              Careers
            </h1>

            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#f59e0b]/30 bg-[#f59e0b]/10 px-4 py-1.5 text-sm font-medium text-[#f59e0b]">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#f59e0b]" />
              </span>
              We&apos;re not actively hiring right now
            </div>

            <Stepper
              initialStep={1}
              backButtonText="Back"
              nextButtonText="Continue"
              loading={submitting}
              onBeforeNext={async (step) => {
                if (step === 1) {
                  if (!email) {
                    setEmailError("Email is required.");
                    return false;
                  }
                  if (!isValidEmail(email)) {
                    setEmailError("Please enter a valid email address.");
                    return false;
                  }
                  setEmailError(null);
                }
                if (step === 2) {
                  setFileError(null);
                }
                if (step === 3) {
                  setSubmitting(true);
                  setSubmitError(null);
                  try {
                    const supabase = createClient();
                    let resumeUrl: string | null = null;

                    if (resumeFile) {
                      const ext = resumeFile.name.split(".").pop();
                      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
                      const { error: uploadError } = await supabase.storage
                        .from("resumes")
                        .upload(path, resumeFile);
                      if (uploadError) throw uploadError;
                      resumeUrl = path;
                    }

                    const { error: insertError } = await supabase
                      .from("career_table")
                      .insert({
                        full_name: fullName || null,
                        email,
                        resume_url: resumeUrl,
                      });
                    if (insertError) throw insertError;

                    return true;
                  } catch (err) {
                    setSubmitError(
                      err instanceof Error ? err.message : "Something went wrong. Please try again."
                    );
                    return false;
                  } finally {
                    setSubmitting(false);
                  }
                }
                return true;
              }}
            >
              <Step>
                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="mb-1.5 block text-left text-sm font-medium text-[#fafafa]"
                    >
                      Full name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full rounded-lg border border-white/10 bg-white/[0.06] px-5 py-3 text-sm text-[#fafafa] placeholder-[#808080] outline-none transition focus:border-[#0A29FF]/50 focus:ring-1 focus:ring-[#0A29FF]/30"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-left text-sm font-medium text-[#fafafa]"
                    >
                      Email
                    </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        onBlur={handleEmailBlur}
                        placeholder="jane@example.com"
                        className="w-full rounded-lg border border-white/10 bg-white/[0.06] px-5 py-3 text-sm text-[#fafafa] placeholder-[#808080] outline-none transition focus:border-[#0A29FF]/50 focus:ring-1 focus:ring-[#0A29FF]/30"
                      />
                      {emailError && (
                        <p className="mt-1.5 text-xs font-medium text-[#e74c3c]">
                          {emailError}
                        </p>
                      )}
                  </div>
                  <p className="text-xs leading-relaxed text-[#808080]">
                    We&apos;re not hiring right now. If that changes, we&apos;ll
                    use this to get in touch.
                  </p>
                </div>
              </Step>

              <Step>
                <div>
                  <label className="mb-1.5 block text-left text-sm font-medium text-[#fafafa]">
                    Resume
                  </label>
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-10 text-center transition hover:border-[#0A29FF]/40 hover:bg-[#0A29FF]/[0.03]"
                  >
                    <svg
                      className="h-8 w-8 text-[#808080]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                      />
                    </svg>
                    {resumeFile ? (
                      <div>
                        <p className="text-sm font-medium text-[#fafafa]">
                          {resumeFile.name}
                        </p>
                        <p className="mt-1 text-xs text-[#808080]">
                          {(resumeFile.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-[#a3a3a3]">
                          Drop your resume here or{" "}
                          <span className="font-medium text-[#0A29FF]">
                            browse
                          </span>
                        </p>
                        <p className="mt-1 text-xs text-[#808080]">
                          PDF up to 10 MB
                        </p>
                      </div>
                    )}
                  </div>
                  {fileError && (
                    <p className="mt-2 text-xs font-medium text-[#e74c3c]">
                      {fileError}
                    </p>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </Step>

              <Step>
                <div className="space-y-4 text-left">
                  <h3 className="text-base font-semibold text-[#fafafa]">
                    Review your details
                  </h3>
                  <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.04] p-5">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#808080]">Name</span>
                      <span className="font-medium text-[#fafafa]">
                        {fullName || "—"}
                      </span>
                    </div>
                    <div className="h-px bg-white/10" />
                    <div className="flex justify-between text-sm">
                      <span className="text-[#808080]">Email</span>
                      <span className="font-medium text-[#fafafa]">
                        {email || "—"}
                      </span>
                    </div>
                    <div className="h-px bg-white/10" />
                    <div className="flex justify-between text-sm">
                      <span className="text-[#808080]">Resume</span>
                      <span className="font-medium text-[#fafafa]">
                        {resumeFile ? resumeFile.name : "Not uploaded"}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed text-[#808080]">
                    By submitting, you agree to let FreeLynk store your
                    information for future hiring consideration. We&apos;ll
                    never share it with third parties.
                  </p>
                  {submitError && (
                    <p className="text-xs font-medium text-[#e74c3c]">
                      {submitError}
                    </p>
                  )}
                </div>
              </Step>

              <Step>
                <div className="flex flex-col items-center py-4 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#0A29FF]/15">
                    <svg
                      className="h-7 w-7 text-[#0A29FF]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-[#fafafa]">
                    Application received
                  </h3>
                  <p className="max-w-xs text-sm leading-relaxed text-[#a3a3a3]">
                    Thanks{fullName ? `, ${fullName}` : ""}. We&apos;ll keep
                    your info on file and reach out when the time is right.
                  </p>
                </div>
              </Step>
            </Stepper>
          </div>
        </main>
      </div>
    </div>
  );
}
