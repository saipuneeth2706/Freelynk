'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect, useLayoutEffect } from 'react';
import { ReactLenis, type LenisRef } from 'lenis/react';
import { usePathname } from 'next/navigation';

interface LenisContextValue {
  isReady: boolean;
  wrapper: HTMLDivElement | null;
}

const LenisContext = createContext<LenisContextValue>({
  isReady: false,
  wrapper: null,
});

export const useLenisScroll = () => useContext(LenisContext);

export const getScroller = (ctx: LenisContextValue): Element | undefined =>
  ctx.wrapper ?? undefined;

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [ctx, setCtx] = useState<LenisContextValue>({
    isReady: false,
    wrapper: null,
  });
  const lenisRef = useRef<LenisRef | null>(null);
  const pathname = usePathname();

  const ref = useCallback((ref: LenisRef | null) => {
    lenisRef.current = ref;
    if (ref?.lenis) {
      setCtx({ isReady: true, wrapper: ref.wrapper });
    }
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (!lenis) return;
    const id = requestAnimationFrame(() => {
      lenis.resize();
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useLayoutEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (!lenis) return;
    window.scrollTo(0, 0);
    lenis.scrollTo(0, { immediate: true, force: true });
    lenis.resize();
  }, [pathname]);

  return (
    <LenisContext.Provider value={ctx}>
      <ReactLenis ref={ref} root options={{ lerp: 0.1, duration: 1.2 }}>
        {children}
      </ReactLenis>
    </LenisContext.Provider>
  );
}
