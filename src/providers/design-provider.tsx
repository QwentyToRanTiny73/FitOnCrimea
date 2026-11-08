"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { publishedDesign, resolveSlot, type Banner, type DesignDraft, type DesignImage, type DesignOverrides, type DesignSlotKey } from "@/data/design";
import { isDraftEmpty, mergeDesign } from "@/data/design/sanitize";
import { designStore } from "@/services";

interface DesignContextValue {
  /** Неопубликованные правки оформления (в этом браузере). */
  draft: DesignDraft;
  /** Опубликованное оформление с черновиком — так видит сайт администратор. */
  design: DesignOverrides;
  hasDraft: boolean;
  /** Новая картинка слота; null — вернуть исходную из брошюры. */
  setSlot: (key: DesignSlotKey, image: DesignImage | null) => void;
  /** Отменить черновик слота (оставить опубликованное). */
  discardSlot: (key: DesignSlotKey) => void;
  setBanners: (banners: Banner[]) => void;
  discardBanners: () => void;
  replaceDraft: (draft: DesignDraft) => void;
}

const DesignContext = createContext<DesignContextValue | null>(null);

export function DesignProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<DesignDraft>({});

  useEffect(() => setDraft(designStore.load()), []);

  const commit = useCallback((next: DesignDraft) => {
    const res = designStore.save(next);
    if (!res.ok) {
      throw new Error(
        res.reason === "quota"
          ? "Хранилище браузера переполнено. Опубликуйте изменения или уменьшите картинки."
          : "Браузер запрещает сохранять данные."
      );
    }
    setDraft(next);
  }, []);

  const setSlot = useCallback(
    (key: DesignSlotKey, image: DesignImage | null) => {
      const images = { ...draft.images };
      if (image === null && !publishedDesign.images?.[key]) delete images[key];
      else images[key] = image;
      commit({ ...draft, images });
    },
    [commit, draft]
  );

  const discardSlot = useCallback(
    (key: DesignSlotKey) => {
      const images = { ...draft.images };
      delete images[key];
      commit({ ...draft, images });
    },
    [commit, draft]
  );

  const setBanners = useCallback((banners: Banner[]) => commit({ ...draft, banners }), [commit, draft]);

  const discardBanners = useCallback(() => {
    const { banners: _drop, ...rest } = draft;
    void _drop;
    commit(rest);
  }, [commit, draft]);

  const design = useMemo(() => mergeDesign(publishedDesign, draft), [draft]);

  const value = useMemo<DesignContextValue>(
    () => ({
      draft,
      design,
      hasDraft: !isDraftEmpty(draft),
      setSlot,
      discardSlot,
      setBanners,
      discardBanners,
      replaceDraft: commit,
    }),
    [draft, design, setSlot, discardSlot, setBanners, discardBanners, commit]
  );

  return <DesignContext.Provider value={value}>{children}</DesignContext.Provider>;
}

export function useDesign(): DesignContextValue {
  const ctx = useContext(DesignContext);
  if (!ctx) throw new Error("useDesign must be used inside <DesignProvider>");
  return ctx;
}

/** Картинка слота с учётом черновика; на сервере — опубликованная. */
export function useSlotImage(key: DesignSlotKey): DesignImage {
  const { design } = useDesign();
  return resolveSlot(design, key);
}
