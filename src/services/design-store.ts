import { sanitizeDraft } from "@/data/design/sanitize";
import type { DesignDraft } from "@/data/design/types";
import { readJSON, writeJSON, type WriteResult } from "./storage";

/**
 * Черновик оформления (картинки и баннеры) — в браузере администратора,
 * пока его не опубликуют (services/publisher.ts) или не сбросят.
 */
export interface DesignStore {
  readonly mode: "local-demo" | "remote";
  load(): DesignDraft;
  save(draft: DesignDraft): WriteResult;
}

export const localDesignStore: DesignStore = {
  mode: "local-demo",
  load: () => sanitizeDraft(readJSON<unknown>("design-draft", {})),
  save: (draft) => writeJSON("design-draft", draft),
};
