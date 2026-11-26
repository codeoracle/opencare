"use client";

import { createContext, useContext } from "react";
import { withBase } from "@/lib/hosts";

const BasePathContext = createContext("");

/** Provides the brand's link prefix ("/bilef" or "") to client components. */
export function BasePathProvider({ base, children }: { base: string; children: React.ReactNode }) {
  return <BasePathContext.Provider value={base}>{children}</BasePathContext.Provider>;
}

export function useBasePath() {
  return useContext(BasePathContext);
}

/** Link helper for client components: useHref()("/products") → "/bilef/products". */
export function useHref() {
  const base = useContext(BasePathContext);
  return (path: string) => withBase(base, path);
}
