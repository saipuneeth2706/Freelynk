"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { createClient } from "@/lib/supabase/client";
import BorderGlow from "@/components/ui/BorderGlow";
import type { User } from "@supabase/supabase-js";

interface RoleOption {
  id: "freelancer" | "employer";
  title: string;
  description: string;
  icon: React.ReactNode;
  glowColors: string[];
  glowColor: string;
}

const roles: RoleOption[] = [
  {
    id: "freelancer",
    title: "Freelancer",
    description:
      "Find work, showcase skills, and get paid for projects you love.",
    glowColors: ["#0A29FF", "#38bdf8", "#6366f1"],
    glowColor: "230 80 60",
    icon: (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        className="h-12 w-12"
        aria-hidden="true"
      >
        <rect
          x="4"
          y="8"
          width="40"
          height="32"
          rx="4"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M16 20h16M16 26h10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="34" cy="30" r="6" fill="currentColor" opacity="0.15" />
        <path
          d="M32 30l1.5 1.5L36 29"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "employer",
    title: "Employer",
    description: "Post projects, hire talent, and bring your ideas to life.",
    glowColors: ["#7B3FE4", "#c084fc", "#a855f7"],
    glowColor: "270 70 60",
    icon: (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        className="h-12 w-12"
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
        <circle cx="24" cy="28" r="4" fill="currentColor" opacity="0.15" />
        <path
          d="M24 26v4M22 28h4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function RoleSelect() {
  const [selected, setSelected] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hintRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);

      if (data.user) {
        const { data: existing } = await supabase
          .from("user_table")
          .select("role")
          .eq("user_id", data.user.id)
          .single();

        if (existing) {
          window.location.href =
            existing.role === "freelancer" ? "/dashboard" : "/employer";
          return;
        }
      }

      setChecking(false);
    });
  }, []);

  useEffect(() => {
    if (checking) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      headingRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7 },
    )
      .fromTo(
        subtextRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.4",
      )
      .fromTo(
        cardRefs.current,
        { opacity: 0, y: 30, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.12,
        },
        "-=0.3",
      )
      .fromTo(
        hintRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        "-=0.2",
      );
  }, [checking]);

  const handleSelect = async (roleId: "freelancer" | "employer") => {
    if (!user) return;
    setSelected(roleId);
    setLoading(true);

    console.log("User object:", user);
    console.log("User ID:", user.id);

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      data: { role: roleId },
    });

    if (updateError) {
      console.error("Update error:", updateError);
      setLoading(false);
      setSelected(null);
      return;
    }

    const insertPayload = {
      user_id: user.id,
      role: roleId,
      email: user.email,
      full_name: user.user_metadata?.full_name ?? null,
    };
    console.log("Insert payload:", insertPayload);

    const { error: insertError } = await supabase
      .from("user_table")
      .insert(insertPayload);

    if (insertError) {
      console.error("Insert error:", insertError.message, insertError.details, insertError.hint);
      setLoading(false);
      setSelected(null);
      return;
    }
    window.location.href =
      roleId === "freelancer" ? "/dashboard" : "/employer";
  };

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#0B0B0F] px-6"
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.07]"
          style={{
            background: "radial-gradient(circle, #fff 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center gap-12">
        {checking ? (
          <div className="flex flex-col items-center gap-4">
            <svg
              className="h-8 w-8 animate-spin text-neutral-500"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.25"
              />
              <path
                d="M12 2a10 10 0 0 1 10 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <p className="text-sm text-neutral-500">Setting things up…</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-4 text-center">
              <h1
                ref={headingRef}
                className="text-3xl font-semibold tracking-tight text-white sm:text-4xl"
                style={{ textWrap: "balance", opacity: 0, transform: "translateY(20px)" }}
              >
                Welcome to FreeLynk
              </h1>
              <p
                ref={subtextRef}
                className="max-w-md text-base leading-relaxed text-neutral-400"
                style={{ opacity: 0, transform: "translateY(14px)" }}
              >
                {user?.user_metadata?.full_name
                  ? `Hey ${user.user_metadata.full_name.split(" ")[0]}, `
                  : "How would you like to use "}
                {user?.user_metadata?.full_name
                  ? "how would you like to use FreeLynk?"
                  : "FreeLynk?"}
              </p>
            </div>

            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              {roles.map((role, i) => {
                const isActive = selected === role.id;
                const isDisabled = selected !== null && !isActive;

                return (
                  <div
                    key={role.id}
                    ref={(el) => {
                      cardRefs.current[i] = el;
                    }}
                    style={{ opacity: 0, transform: "translateY(30px) scale(0.96)" }}
                    className={`transition-all duration-300 ${
                      isDisabled ? "opacity-40" : ""
                    } ${isActive ? "scale-[1.02]" : ""}`}
                  >
                    <BorderGlow
                      animated={true}
                      backgroundColor="#120F17"
                      borderRadius={20}
                      glowColor={role.glowColor}
                      glowRadius={80}
                      glowIntensity={3}
                      edgeSensitivity={0}
                      coneSpread={35}
                      colors={role.glowColors}
                      fillOpacity={0.4}
                      className="h-full"
                    >
                      <button
                        onClick={() => handleSelect(role.id)}
                        disabled={selected !== null || !user}
                        className="group flex h-full w-full flex-col items-start gap-5 p-7 text-left"
                      >
                        <div
                          className={`flex h-14 w-14 items-center justify-center rounded-xl transition-colors duration-300 ${
                            isActive
                              ? "text-white"
                              : "text-neutral-500 group-hover:text-neutral-300"
                          }`}
                          style={{
                            background: isActive
                              ? `${role.glowColors[0]}20`
                              : "rgba(255,255,255,0.04)",
                          }}
                        >
                          {role.icon}
                        </div>

                        <div className="flex flex-col gap-2">
                          <h2
                            className={`text-xl font-semibold transition-colors duration-300 ${
                              isActive ? "text-white" : "text-neutral-200"
                            }`}
                          >
                            {role.title}
                          </h2>
                          <p className="text-sm leading-relaxed text-neutral-500">
                            {role.description}
                          </p>
                        </div>

                        <div
                          className={`mt-auto flex items-center gap-2 pt-3 text-sm transition-all duration-300 ${
                            isActive
                              ? "text-white"
                              : "text-neutral-600 group-hover:text-neutral-400"
                          }`}
                        >
                          {isActive ? (
                            <span className="flex items-center gap-2">
                              <svg
                                className="h-4 w-4 animate-spin"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  opacity="0.25"
                                />
                                <path
                                  d="M12 2a10 10 0 0 1 10 10"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                              </svg>
                              Setting up…
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 transition-transform duration-300 group-hover:translate-x-1">
                              Select
                              <svg
                                className="h-4 w-4"
                                viewBox="0 0 16 16"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M6 3l5 5-5 5" />
                              </svg>
                            </span>
                          )}
                        </div>
                      </button>
                    </BorderGlow>
                  </div>
                );
              })}
            </div>

            <p ref={hintRef} className="text-center text-xs text-neutral-600" style={{ opacity: 0 }}>
              You can change this later in your profile settings.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
