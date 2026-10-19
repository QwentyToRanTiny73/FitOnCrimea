"use client";

import { useAuth } from "@/providers";
import { Notice } from "./Form";

/** Предупреждение, пока авторизация работает в демо-режиме (только в браузере). */
export function DemoNotice() {
  const { mode } = useAuth();
  if (mode !== "local-demo") return null;
  return (
    <Notice tone="info">
      Демо-режим: аккаунт хранится только в этом браузере и на других устройствах недоступен.
    </Notice>
  );
}
