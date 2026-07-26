'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { ReactLenis, type LenisRef } from 'lenis/react';

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

  const ref = useCallback((ref: LenisRef | null) => {
    if (ref?.lenis) {
      setCtx({ isReady: true, wrapper: ref.wrapper });
    }
  }, []);

  return (
    <LenisContext.Provider value={ctx}>
      <ReactLenis ref={ref} root options={{ lerp: 0.1, duration: 1.2 }}>
        {children}
      </ReactLenis>
    </LenisContext.Provider>
  );
}
