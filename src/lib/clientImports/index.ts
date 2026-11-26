import { importRafcare } from "@/lib/clientImports/rafcare";
import { importGlossyLovely } from "@/lib/clientImports/glossyLovely";

/** Ready-made client catalogues that can be loaded from Admin → Clients. */
export const CLIENT_IMPORTS = {
  rafcare: { label: "RAFCARE", products: 68, run: importRafcare },
  "glossy-lovely": { label: "Glossy & Lovely", products: 15, run: importGlossyLovely },
} as const;

export type ClientImportKey = keyof typeof CLIENT_IMPORTS;

export function isClientImportKey(key: string): key is ClientImportKey {
  return Object.prototype.hasOwnProperty.call(CLIENT_IMPORTS, key);
}
