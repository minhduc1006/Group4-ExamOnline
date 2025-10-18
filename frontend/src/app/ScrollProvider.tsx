"use client";
import { createContext, useContext, useRef } from "react";

export const ScrollContext = createContext<{
  feedbackRef: React.RefObject<HTMLDivElement>;
} | null>(null);

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const feedbackRef = useRef<HTMLDivElement>(null!);

  return (
    <ScrollContext.Provider value={{ feedbackRef }}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScroll() {
  return useContext(ScrollContext);
}
