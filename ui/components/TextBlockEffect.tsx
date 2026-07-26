"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import { useLenisScroll, getScroller } from "@/contexts/LenisContext";

gsap.registerPlugin(ScrollTrigger);

export interface TextBlockProps {
  blockColor?: string;
  textColor?: string;
  fontFamily?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export const TextBlock: React.FC<TextBlockProps> = ({
  blockColor = "#DDFC3E",
  textColor = "#ededed",
  fontFamily = "'DM Sans', sans-serif",
  className,
  style = {},
  children,
}) => (
  <div
    className={cn(
      "relative z-[2] flex max-w-[900px] flex-col items-center justify-center text-center",
      className,
    )}
    data-text-block-wrapper
  >
    <p
      data-text-block
      data-block-color={blockColor}
      className="text-[clamp(2.5rem,6vw,5.5rem)] font-normal leading-[1.1] tracking-tight opacity-0"
      style={{ color: textColor, fontFamily, ...style }}
    >
      {children}
    </p>
  </div>
);

interface TextBlockEffectProps {
  children: React.ReactNode;
  className?: string;
  triggerStart?: string;
  stagger?: number;
}

const TextBlockEffect: React.FC<TextBlockEffectProps> = ({
  children,
  className,
  triggerStart = "top 50%",
  stagger = 0.4,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lenisContext = useLenisScroll();
  const scroller = getScroller(lenisContext);
  const splitInstancesRef = useRef<{ revert: () => void }[]>([]);

  useGSAP(
    () => {
      if (!lenisContext.isReady || !containerRef.current) return;

      const texts =
        containerRef.current.querySelectorAll<HTMLParagraphElement>(
          "[data-text-block]",
        );
      const triggers: ScrollTrigger[] = [];

      texts.forEach((textEl) => {
        try {
          const color = textEl.dataset.blockColor ?? "#DDFC3E";
          const lineTexts: HTMLElement[] = [];
          const lineBoxes: HTMLElement[] = [];

          const segments = textEl.innerHTML.split(/<br\s*\/?>/i);

          if (segments.length > 1) {
            textEl.style.opacity = "1";

            const originalHTML = textEl.innerHTML;
            textEl.innerHTML = "";

            segments.forEach((segment) => {
              const line = document.createElement("div");
              line.className = "line";
              line.style.position = "relative";
              line.style.display = "block";
              line.style.width = "fit-content";
              line.style.marginLeft = "auto";
              line.style.marginRight = "auto";

              const lineText = document.createElement("div");
              lineText.className = "line-text";
              lineText.innerHTML = segment;

              const lineBox = document.createElement("div");
              lineBox.className = "line-box";
              lineBox.style.cssText =
                "position:absolute;left:-1%;top:0;height:102%;width:102%;transform-origin:left center;background-color:" +
                color +
                ";";

              line.appendChild(lineText);
              line.appendChild(lineBox);
              textEl.appendChild(line);

              gsap.set(lineBox, { scaleX: 1 });
              gsap.set(lineText, { opacity: 1 });

              lineTexts.push(lineText);
              lineBoxes.push(lineBox);
            });

            const dur = 0.35;
            const section = textEl.closest("section");
            if (!section) return;

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: triggerStart,
                scroller: scroller || undefined,
              },
            });

            tl.to(lineBoxes, {
              scaleX: 0,
              transformOrigin: "right center",
              duration: dur,
              stagger: stagger,
              ease: "power2.inOut",
            });

            const st = tl.scrollTrigger;
            if (st) triggers.push(st);

            splitInstancesRef.current.push({
              revert: () => {
                textEl.innerHTML = originalHTML;
                textEl.style.opacity = "";
              },
            });
          }
        } catch (e) {
          console.warn("[TextBlockEffect] Animation failed:", e);
        }
      });

      ScrollTrigger.refresh();

      return () => {
        splitInstancesRef.current.forEach((s) => s.revert());
        splitInstancesRef.current = [];
        triggers.forEach((t) => t.kill());
      };
    },
    {
      scope: containerRef,
      dependencies: [lenisContext.isReady, scroller, triggerStart, stagger],
    },
  );

  return (
    <main
      ref={containerRef}
      className={cn(
        "min-h-screen w-full overflow-x-hidden bg-[#0B0B0F] text-[#ededed]",
        className,
      )}
    >
      {children}
    </main>
  );
};

export default TextBlockEffect;
