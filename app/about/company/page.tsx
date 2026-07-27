"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import CardNav from "@/components/CardNav";
import LineSidebar from "@/components/LineSidebar";
import CursorGrid from "@/components/CursorGrid";

gsap.registerPlugin(ScrollTrigger);

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

const sidebarItems = [
  "Mission",
  "What We Do",
  "Who It's For",
  "How It Works",
  "Our Approach",
  "Story",
  "Values",
  "Roadmap",
  "Join Us",
];

export default function CompanyPage() {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeSection, setActiveSection] = useState(0);
  const [visibleSections, setVisibleSections] = useState<number[]>([]);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      // Hero: clip-path wipe from left
      if (heroRef.current) {
        if (reducedMotion) {
          gsap.set(heroRef.current, { opacity: 1 });
        } else {
          gsap.set(heroRef.current, { clipPath: "inset(0 100% 0 0)" });
          gsap.to(heroRef.current, {
            clipPath: "inset(0 0% 0 0)",
            duration: 1,
            ease: "power4.out",
            delay: 0.2,
          });
        }
      }

      // ── Section 0: Mission — heading wipe, paragraphs stagger ──
      const sec0 = sectionRefs.current[0];
      if (sec0) {
        const heading = sec0.querySelector(".mission-heading");
        const paragraphs = sec0.querySelectorAll(".mission-prose");

        if (reducedMotion) {
          gsap.set([heading, ...paragraphs], { opacity: 1 });
        } else {
          if (heading) {
            gsap.set(heading, { clipPath: "inset(0 100% 0 0)" });
            ScrollTrigger.create({
              trigger: sec0,
              start: "top 80%",
              onEnter: () =>
                gsap.to(heading, {
                  clipPath: "inset(0 0% 0 0)",
                  duration: 0.8,
                  ease: "power4.out",
                }),
            });
          }
          if (paragraphs.length) {
            gsap.set(paragraphs, { opacity: 0, x: -20 });
            ScrollTrigger.create({
              trigger: sec0,
              start: "top 75%",
              onEnter: () =>
                gsap.to(paragraphs, {
                  opacity: 1,
                  x: 0,
                  duration: 0.6,
                  stagger: 0.15,
                  ease: "power3.out",
                  delay: 0.3,
                }),
            });
          }
        }
      }

      // ── Section 1: What We Do — feature items slide from alternating sides ──
      const sec1 = sectionRefs.current[1];
      if (sec1) {
        const heading = sec1.querySelector(".feature-heading");
        const items = sec1.querySelectorAll(".feature-item");

        if (reducedMotion) {
          gsap.set([heading, ...items], { opacity: 1 });
        } else {
          if (heading) {
            gsap.set(heading, { opacity: 0, y: 15 });
            ScrollTrigger.create({
              trigger: sec1,
              start: "top 80%",
              onEnter: () =>
                gsap.to(heading, {
                  opacity: 1,
                  y: 0,
                  duration: 0.5,
                  ease: "power3.out",
                }),
            });
          }
          if (items.length) {
            gsap.set(items, (i: number) => ({
              opacity: 0,
              x: i % 2 === 0 ? -30 : 30,
            }));
            ScrollTrigger.create({
              trigger: sec1,
              start: "top 75%",
              onEnter: () =>
                gsap.to(items, {
                  opacity: 1,
                  x: 0,
                  duration: 0.6,
                  stagger: 0.1,
                  ease: "power3.out",
                  delay: 0.15,
                }),
            });
          }
        }
      }

      // ── Section 2: Who It's For — columns slide from opposite sides ──
      const sec2 = sectionRefs.current[2];
      if (sec2) {
        const heading = sec2.querySelector(".compare-heading");
        const cols = sec2.querySelectorAll(".compare-col");

        if (reducedMotion) {
          gsap.set([heading, ...cols], { opacity: 1 });
        } else {
          if (heading) {
            gsap.set(heading, { opacity: 0, y: 15 });
            ScrollTrigger.create({
              trigger: sec2,
              start: "top 80%",
              onEnter: () =>
                gsap.to(heading, {
                  opacity: 1,
                  y: 0,
                  duration: 0.5,
                  ease: "power3.out",
                }),
            });
          }
          if (cols.length) {
            gsap.set(cols, (i: number) => ({
              opacity: 0,
              x: i === 0 ? -40 : 40,
            }));
            ScrollTrigger.create({
              trigger: sec2,
              start: "top 75%",
              onEnter: () =>
                gsap.to(cols, {
                  opacity: 1,
                  x: 0,
                  duration: 0.7,
                  stagger: 0.2,
                  ease: "power3.out",
                  delay: 0.15,
                }),
            });
          }
        }
      }

      // ── Section 3: How It Works — steps cascade in ──
      const sec3 = sectionRefs.current[3];
      if (sec3) {
        const heading = sec3.querySelector(".steps-heading");
        const steps = sec3.querySelectorAll(".step-item");

        if (reducedMotion) {
          gsap.set([heading, ...steps], { opacity: 1 });
        } else {
          if (heading) {
            gsap.set(heading, { opacity: 0, y: 15 });
            ScrollTrigger.create({
              trigger: sec3,
              start: "top 80%",
              onEnter: () =>
                gsap.to(heading, {
                  opacity: 1,
                  y: 0,
                  duration: 0.5,
                  ease: "power3.out",
                }),
            });
          }
          if (steps.length) {
            gsap.set(steps, { opacity: 0, x: -20 });
            ScrollTrigger.create({
              trigger: sec3,
              start: "top 75%",
              onEnter: () =>
                gsap.to(steps, {
                  opacity: 1,
                  x: 0,
                  duration: 0.5,
                  stagger: 0.18,
                  ease: "power3.out",
                  delay: 0.15,
                }),
            });
          }
        }
      }

      // ── Section 4: Pull Quote — line expands, text reveals ──
      const sec4 = sectionRefs.current[4];
      if (sec4) {
        const line = sec4.querySelector(".quote-line");
        const text = sec4.querySelector(".quote-text");
        const attr = sec4.querySelector(".quote-attr");

        if (reducedMotion) {
          gsap.set([line, text, attr], { opacity: 1 });
        } else {
          if (line) {
            gsap.set(line, { scaleX: 0 });
            ScrollTrigger.create({
              trigger: sec4,
              start: "top 80%",
              onEnter: () =>
                gsap.to(line, {
                  scaleX: 1,
                  duration: 0.8,
                  ease: "power4.inOut",
                }),
            });
          }
          if (text) {
            gsap.set(text, { opacity: 0, y: 10 });
            ScrollTrigger.create({
              trigger: sec4,
              start: "top 80%",
              onEnter: () =>
                gsap.to(text, {
                  opacity: 1,
                  y: 0,
                  duration: 0.7,
                  ease: "power3.out",
                  delay: 0.3,
                }),
            });
          }
          if (attr) {
            gsap.set(attr, { opacity: 0 });
            ScrollTrigger.create({
              trigger: sec4,
              start: "top 80%",
              onEnter: () =>
                gsap.to(attr, {
                  opacity: 1,
                  duration: 0.5,
                  delay: 0.6,
                }),
            });
          }
        }
      }

      // ── Section 5: Our Story — paragraphs stagger ──
      const sec5 = sectionRefs.current[5];
      if (sec5) {
        const heading = sec5.querySelector(".story-heading");
        const paras = sec5.querySelectorAll(".story-prose");

        if (reducedMotion) {
          gsap.set([heading, ...paras], { opacity: 1 });
        } else {
          if (heading) {
            gsap.set(heading, { clipPath: "inset(0 100% 0 0)" });
            ScrollTrigger.create({
              trigger: sec5,
              start: "top 80%",
              onEnter: () =>
                gsap.to(heading, {
                  clipPath: "inset(0 0% 0 0)",
                  duration: 0.8,
                  ease: "power4.out",
                }),
            });
          }
          if (paras.length) {
            gsap.set(paras, { opacity: 0, y: 12 });
            ScrollTrigger.create({
              trigger: sec5,
              start: "top 75%",
              onEnter: () =>
                gsap.to(paras, {
                  opacity: 1,
                  y: 0,
                  duration: 0.5,
                  stagger: 0.12,
                  ease: "power3.out",
                  delay: 0.3,
                }),
            });
          }
        }
      }

      // ── Section 6: Values — items stagger from left ──
      const sec6 = sectionRefs.current[6];
      if (sec6) {
        const heading = sec6.querySelector(".values-heading");
        const items = sec6.querySelectorAll(".value-item");

        if (reducedMotion) {
          gsap.set([heading, ...items], { opacity: 1 });
        } else {
          if (heading) {
            gsap.set(heading, { opacity: 0, y: 15 });
            ScrollTrigger.create({
              trigger: sec6,
              start: "top 80%",
              onEnter: () =>
                gsap.to(heading, {
                  opacity: 1,
                  y: 0,
                  duration: 0.5,
                  ease: "power3.out",
                }),
            });
          }
          if (items.length) {
            gsap.set(items, { opacity: 0, x: -20 });
            ScrollTrigger.create({
              trigger: sec6,
              start: "top 75%",
              onEnter: () =>
                gsap.to(items, {
                  opacity: 1,
                  x: 0,
                  duration: 0.5,
                  stagger: 0.1,
                  ease: "power3.out",
                  delay: 0.15,
                }),
            });
          }
        }
      }

      // ── Section 7: Roadmap — dots pop, content slides from right ──
      const sec7 = sectionRefs.current[7];
      if (sec7) {
        const heading = sec7.querySelector(".roadmap-heading");
        const items = sec7.querySelectorAll(".roadmap-item");

        if (reducedMotion) {
          gsap.set([heading, ...items], { opacity: 1 });
        } else {
          if (heading) {
            gsap.set(heading, { opacity: 0, y: 15 });
            ScrollTrigger.create({
              trigger: sec7,
              start: "top 80%",
              onEnter: () =>
                gsap.to(heading, {
                  opacity: 1,
                  y: 0,
                  duration: 0.5,
                  ease: "power3.out",
                }),
            });
          }
          if (items.length) {
            gsap.set(items, { opacity: 0, x: 30 });
            ScrollTrigger.create({
              trigger: sec7,
              start: "top 75%",
              onEnter: () =>
                gsap.to(items, {
                  opacity: 1,
                  x: 0,
                  duration: 0.5,
                  stagger: 0.15,
                  ease: "power3.out",
                  delay: 0.15,
                }),
            });
          }
        }
      }

      // ── Section 8: Join Us — slide up ──
      const sec8 = sectionRefs.current[8];
      if (sec8) {
        if (reducedMotion) {
          gsap.set(sec8, { opacity: 1 });
        } else {
          gsap.set(sec8, { opacity: 0, y: 30 });
          ScrollTrigger.create({
            trigger: sec8,
            start: "top 85%",
            onEnter: () =>
              gsap.to(sec8, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power3.out",
              }),
          });
        }
      }
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionRefs.current.forEach((section, i) => {
      if (!section) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(i);
            setVisibleSections((prev) =>
              prev.includes(i) ? prev : [...prev, i],
            );
          } else {
            setVisibleSections((prev) => prev.filter((v) => v !== i));
          }
        },
        { threshold: 0.2, rootMargin: "-5% 0px -20% 0px" },
      );
      observer.observe(section);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleSidebarClick = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="relative min-h-screen bg-[#0B0B0F]">
      <div className="fixed inset-0 z-0 bg-[#0B0B0F]">
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

      <section
        ref={heroRef}
        className="relative flex min-h-[60vh] items-center justify-center px-6 pt-24 overflow-hidden"
      >
        <div className="flex max-w-3xl flex-col items-center gap-6 text-center">
          <h1
            className="text-4xl font-medium tracking-[-0.03em] text-white sm:text-5xl md:text-6xl"
            style={{ textWrap: "balance", lineHeight: 1.1 }}
          >
            FreeLynk
          </h1>
          <p
            className="max-w-lg text-lg leading-relaxed text-neutral-400"
            style={{ textWrap: "pretty" }}
          >
            Where talent meets opportunity, without the noise.
          </p>
        </div>
      </section>

      <div className="relative pt-4">
        <div className="mx-auto flex max-w-7xl gap-0 px-6 pb-32 lg:gap-12">
          <aside className="sticky top-32 hidden h-fit shrink-0 lg:block lg:w-56">
            <LineSidebar
              items={sidebarItems}
              accentColor="#0A29FF"
              textColor="#a3a3a3"
              markerColor="#333"
              showIndex={false}
              showMarker={true}
              proximityRadius={80}
              maxShift={20}
              falloff="smooth"
              markerLength={40}
              markerGap={12}
              tickScale={0.4}
              scaleTick={true}
              itemGap={24}
              fontSize={0.9}
              smoothing={120}
              defaultActive={activeSection}
              visibleIndices={visibleSections}
              onItemClick={handleSidebarClick}
            />
          </aside>

          <main ref={contentRef} className="flex-1 min-w-0 pt-8">
            {/* ── Mission ── */}
            <section
              ref={(el) => {
                sectionRefs.current[0] = el;
              }}
              className="mb-20"
            >
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#0A29FF] mb-4">
                Our Mission
              </p>
              <h2
                className="mission-heading text-3xl font-semibold tracking-[-0.02em] text-white md:text-4xl max-w-3xl"
                style={{ textWrap: "balance", lineHeight: 1.15 }}
              >
                A freelance marketplace that respects your time.
              </h2>
              <div className="mt-8 max-w-2xl flex flex-col gap-5">
                <p
                  className="mission-prose text-base leading-[1.75] text-neutral-400"
                  style={{ textWrap: "pretty" }}
                >
                  Existing platforms are bloated. They bury great talent under
                  noise, fees, and friction. FreeLynk exists because freelancing
                  should be about doing good work — not fighting the platform
                  you&apos;re doing it on.
                </p>
                <p
                  className="mission-prose text-base leading-[1.75] text-neutral-400"
                  style={{ textWrap: "pretty" }}
                >
                  We&apos;re building a cleaner, faster way for skilled people
                  to connect with meaningful projects. Less noise. More signal.
                  Better matches, faster. The kind of platform we&apos;d want to
                  use ourselves.
                </p>
              </div>
            </section>

            <div className="mb-20 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* ── What We Do ── */}
            <section
              ref={(el) => {
                sectionRefs.current[1] = el;
              }}
              className="mb-20"
            >
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#0A29FF] mb-4">
                What We Do
              </p>
              <h2
                className="feature-heading text-2xl font-semibold tracking-[-0.02em] text-white md:text-3xl max-w-3xl mb-10"
                style={{ textWrap: "balance", lineHeight: 1.2 }}
              >
                Matchmaking for talent and projects.
              </h2>
              <div className="grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2">
                {[
                  {
                    icon: (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                      </svg>
                    ),
                    title: "Smart Matching",
                    desc: "Our system pairs freelancers with projects based on skills, availability, and fit — not just keywords.",
                  },
                  {
                    icon: (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    ),
                    title: "Clean Profiles",
                    desc: "Showcase your best work without the clutter. One profile, clear skills, verified outcomes.",
                  },
                  {
                    icon: (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                      >
                        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                      </svg>
                    ),
                    title: "Direct Communication",
                    desc: "No middlemen. Freelancers and employers talk directly, negotiate fairly, and get to work.",
                  },
                  {
                    icon: (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                      >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    ),
                    title: "Fair Pricing",
                    desc: "Transparent fee structure. No hidden cuts, no surprise deductions. What you earn is what you keep.",
                  },
                ].map((item) => (
                  <div key={item.title} className="feature-item flex gap-4">
                    <div className="shrink-0 mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-[#0A29FF]">
                      {item.icon}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <h3 className="text-base font-semibold text-white">
                        {item.title}
                      </h3>
                      <p
                        className="text-sm leading-relaxed text-neutral-500"
                        style={{ textWrap: "pretty" }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="mb-20 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* ── Who It's For ── */}
            <section
              ref={(el) => {
                sectionRefs.current[2] = el;
              }}
              className="mb-20"
            >
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#0A29FF] mb-4">
                Who It&apos;s For
              </p>
              <h2
                className="compare-heading text-2xl font-semibold tracking-[-0.02em] text-white md:text-3xl max-w-3xl mb-10"
                style={{ textWrap: "balance", lineHeight: 1.2 }}
              >
                Built for both sides of the table.
              </h2>
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
                <div className="compare-col">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0A29FF]/10">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#0A29FF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <rect x="2" y="7" width="20" height="14" rx="2" />
                        <path d="M16 7V5a4 4 0 0 0-8 0v2" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      For Freelancers
                    </h3>
                  </div>
                  <ul className="flex flex-col gap-3">
                    {[
                      "Find projects that match your exact skill set",
                      "No bidding wars — get matched, not ranked",
                      "Keep what you earn with transparent fees",
                      "Build a portfolio that speaks for itself",
                      "Work directly with employers, no platform middleman",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm text-neutral-400"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0A29FF]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="compare-col">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#7B3FE4]/10">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#7B3FE4"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      For Employers
                    </h3>
                  </div>
                  <ul className="flex flex-col gap-3">
                    {[
                      "Post a project and get matched within hours",
                      "Review pre-vetted talent, not keyword-stuffed resumes",
                      "Direct communication from day one",
                      "Fair, predictable pricing with no surprises",
                      "Hire with confidence — quality over quantity",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm text-neutral-400"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7B3FE4]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* ── How It Works ── */}
            <section
              ref={(el) => {
                sectionRefs.current[3] = el;
              }}
              className="mb-20"
            >
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#0A29FF] mb-4">
                How It Works
              </p>
              <h2
                className="steps-heading text-2xl font-semibold tracking-[-0.02em] text-white md:text-3xl max-w-3xl mb-12"
                style={{ textWrap: "balance", lineHeight: 1.2 }}
              >
                Three steps to meaningful work.
              </h2>
              <div className="relative">
                <div className="absolute left-[19px] top-0 hidden h-full w-px bg-white/[0.06] sm:block" />
                <div className="flex flex-col gap-10 sm:gap-12">
                  {[
                    {
                      num: "01",
                      title: "Create your profile",
                      desc: "Showcase your skills, past work, and what you're looking for. No lengthy forms — just the essentials that matter. Takes two minutes.",
                    },
                    {
                      num: "02",
                      title: "Get matched",
                      desc: "Our system surfaces projects that fit your expertise and availability. No endless scrolling through irrelevant listings. Just signal.",
                    },
                    {
                      num: "03",
                      title: "Do great work",
                      desc: "Connect directly with employers, agree on terms, and deliver. The platform stays out of your way. Focus on what you do best.",
                    },
                  ].map((item) => (
                    <div
                      key={item.num}
                      className="step-item flex gap-6 sm:gap-8"
                    >
                      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0B0B0F] ring-1 ring-white/10">
                        <span className="font-mono text-xs font-semibold text-[#0A29FF]">
                          {item.num}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 pt-1.5">
                        <h3 className="text-lg font-semibold text-white">
                          {item.title}
                        </h3>
                        <p
                          className="max-w-lg text-sm leading-relaxed text-neutral-500"
                          style={{ textWrap: "pretty" }}
                        >
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── Pull Quote ── */}
            <section
              ref={(el) => {
                sectionRefs.current[4] = el;
              }}
              className="mb-20 py-16 border-y border-white/[0.06]"
            >
              <blockquote className="max-w-2xl mx-auto text-center">
                <div className="quote-line h-px bg-white/10 mb-8 origin-center" />
                <p
                  className="quote-text text-2xl font-medium tracking-[-0.01em] text-white md:text-3xl leading-snug"
                  style={{ textWrap: "balance" }}
                >
                  &ldquo;We don&apos;t want to be the biggest platform. We want
                  to be the one that actually works.&rdquo;
                </p>
                <footer className="quote-attr mt-6 flex items-center justify-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-white/[0.06]" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">
                      FreeLynk Team
                    </span>
                    <span className="text-xs text-neutral-600">
                      Founding team
                    </span>
                  </div>
                </footer>
              </blockquote>
            </section>

            {/* ── Our Story ── */}
            <section
              ref={(el) => {
                sectionRefs.current[5] = el;
              }}
              className="mb-20"
            >
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#0A29FF] mb-4">
                Our Story
              </p>
              <h2
                className="story-heading text-2xl font-semibold tracking-[-0.02em] text-white md:text-3xl max-w-3xl mb-8"
                style={{ textWrap: "balance", lineHeight: 1.2 }}
              >
                Started from frustration.
              </h2>
              <div className="max-w-2xl flex flex-col gap-5">
                <p
                  className="story-prose text-base leading-[1.75] text-neutral-400"
                  style={{ textWrap: "pretty" }}
                >
                  FreeLynk began when our founding team — a mix of freelancers
                  and hiring managers — realized that every platform we used
                  made the same mistake: prioritizing volume over fit. We were
                  drowning in options and starving for quality.
                </p>
                <p
                  className="story-prose text-base leading-[1.75] text-neutral-400"
                  style={{ textWrap: "pretty" }}
                >
                  We spent months talking to freelancers who were drowning in
                  irrelevant job alerts, and employers who couldn&apos;t find
                  the right talent without posting on five different sites. The
                  problem wasn&apos;t a lack of options. It was a lack of
                  signal.
                </p>
                <p
                  className="story-prose text-base leading-[1.75] text-neutral-400"
                  style={{ textWrap: "pretty" }}
                >
                  One freelancer told us: &ldquo;I spend more time searching for
                  work than actually doing it.&rdquo; That stuck. It became the
                  problem we wake up every day to solve.
                </p>
                <p
                  className="story-prose text-base leading-[1.75] text-neutral-400"
                  style={{ textWrap: "pretty" }}
                >
                  So we started building. A platform that does less, but does it
                  better. One that respects both sides of the equation and lets
                  the work speak for itself. We&apos;re still early, but every
                  line of code is written with that original frustration in
                  mind.
                </p>
              </div>
            </section>

            <div className="mb-20 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* ── Values ── */}
            <section
              ref={(el) => {
                sectionRefs.current[6] = el;
              }}
              className="mb-20"
            >
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#0A29FF] mb-4">
                Values
              </p>
              <h2
                className="values-heading text-2xl font-semibold tracking-[-0.02em] text-white md:text-3xl max-w-3xl mb-10"
                style={{ textWrap: "balance", lineHeight: 1.2 }}
              >
                What we believe.
              </h2>
              <div className="flex flex-col">
                {[
                  {
                    title: "Simplicity First",
                    desc: "No cluttered dashboards, no overwhelming options. Just a clear path from discovery to done. Every feature earns its place or it doesn't ship.",
                  },
                  {
                    title: "Quality Over Quantity",
                    desc: "Better matches, not more matches. The right talent for the right project, every time. We optimize for outcomes, not volume.",
                  },
                  {
                    title: "Transparent by Default",
                    desc: "No hidden fees, no opaque algorithms. Both sides see exactly how the platform works. Trust is built through clarity.",
                  },
                  {
                    title: "Craft Matters",
                    desc: "Every interaction, every animation, every pixel is intentional. We believe the quality of the tool reflects the quality of the work it enables.",
                  },
                  {
                    title: "Ship Early, Ship Often",
                    desc: "We'd rather launch something useful today than perfect something hypothetical next quarter. Progress over polish.",
                  },
                ].map((value, i) => (
                  <div
                    key={value.title}
                    className={`value-item flex flex-col gap-2 py-6 ${
                      i > 0 ? "border-t border-white/[0.06]" : ""
                    }`}
                  >
                    <h3 className="text-base font-semibold text-white">
                      {value.title}
                    </h3>
                    <p
                      className="max-w-xl text-sm leading-relaxed text-neutral-500"
                      style={{ textWrap: "pretty" }}
                    >
                      {value.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Roadmap ── */}
            <section
              ref={(el) => {
                sectionRefs.current[7] = el;
              }}
              className="mb-20"
            >
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#0A29FF] mb-4">
                Roadmap
              </p>
              <h2
                className="roadmap-heading text-2xl font-semibold tracking-[-0.02em] text-white md:text-3xl max-w-3xl mb-10"
                style={{ textWrap: "balance", lineHeight: 1.2 }}
              >
                What&apos;s coming next.
              </h2>
              <div className="relative pl-8">
                <div className="absolute left-3 top-2 bottom-2 w-px bg-white/[0.06]" />
                <div className="flex flex-col gap-10">
                  {[
                    {
                      period: "Now",
                      title: "Core matching engine",
                      desc: "Smart project-freelancer matching based on skills, availability, and past outcomes. Live and improving daily.",
                      active: true,
                    },
                    {
                      period: "Q3 2026",
                      title: "Portfolio showcases",
                      desc: "Rich project galleries that let freelancers present their work the way it deserves to be seen. Visual, not verbose.",
                      active: false,
                    },
                    {
                      period: "Q4 2026",
                      title: "Integrated payments",
                      desc: "Secure, milestone-based payments that protect both freelancers and employers. Escrow built in.",
                      active: false,
                    },
                    {
                      period: "2027",
                      title: "Community features",
                      desc: "Spaces for freelancers to connect, share knowledge, and grow together. The platform becomes a network.",
                      active: false,
                    },
                  ].map((item) => (
                    <div
                      key={item.period}
                      className="roadmap-item relative flex gap-6"
                    >
                      <div
                        className={`absolute -left-8 top-1.5 h-3 w-3 rounded-full ring-2 ring-[#0B0B0F] ${
                          item.active ? "bg-[#0A29FF]" : "bg-white/[0.08]"
                        }`}
                      />
                      <div className="flex flex-col gap-1.5">
                        <span
                          className={`text-xs font-medium ${
                            item.active ? "text-[#0A29FF]" : "text-neutral-600"
                          }`}
                        >
                          {item.period}
                        </span>
                        <h3 className="text-base font-semibold text-white">
                          {item.title}
                        </h3>
                        <p
                          className="max-w-md text-sm leading-relaxed text-neutral-500"
                          style={{ textWrap: "pretty" }}
                        >
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="mb-16 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* ── Join Us ── */}
            <section
              ref={(el) => {
                sectionRefs.current[8] = el;
              }}
              className="mb-8"
            >
              <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-2">
                  <h2
                    className="text-2xl font-semibold tracking-[-0.02em] text-white md:text-3xl"
                    style={{ textWrap: "balance" }}
                  >
                    Ready to find better work?
                  </h2>
                  <p className="text-sm text-neutral-500 max-w-md">
                    Whether you&apos;re a freelancer or an employer, FreeLynk is
                    where you&apos;ll find what you&apos;re looking for.
                  </p>
                </div>
                <Link
                  href="/"
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#0A29FF] px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:brightness-110 active:scale-[0.97]"
                >
                  Get Started
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
                </Link>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
