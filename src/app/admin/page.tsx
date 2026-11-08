"use client";

import { useCallback, useEffect, useState } from "react";
import { AccountPanel } from "@/components/admin/AccountPanel";
import { AdminAuth } from "@/components/admin/AdminAuth";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminProductForm, emptyProduct } from "@/components/admin/AdminProductForm";
import { AdminShell, isSection, type AdminSection } from "@/components/admin/AdminShell";
import { DesignPanel } from "@/components/admin/DesignPanel";
import { ProductsPanel, isFilter, type Filter } from "@/components/admin/ProductsPanel";
import { PublishPanel } from "@/components/admin/PublishPanel";
import { SheetPanel } from "@/components/admin/SheetPanel";
import { Notice } from "@/components/ui/Form";
import { useAdmin } from "@/providers";

/**
 * Кабинет администратора. Раздел хранится в адресе (#design и т. п.),
 * поэтому обновление страницы и кнопка «назад» не сбрасывают место работы.
 */
export default function AdminPage() {
  const { ready, isAdmin } = useAdmin();
  const [section, setSection] = useState<AdminSection>("overview");
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const read = () => {
      const [s, f] = window.location.hash.slice(1).split(":");
      if (isSection(s)) setSection(s);
      if (f && isFilter(f)) setFilter(f);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const go = useCallback((s: AdminSection, f?: string) => {
    setSection(s);
    setNotice(null);
    setFilter(f && isFilter(f) ? f : "all");
    window.history.replaceState(null, "", `#${s}${f ? `:${f}` : ""}`);
    window.scrollTo({ top: 0 });
  }, []);

  if (!ready || !isAdmin) return <AdminAuth />;

  return (
    <AdminShell section={section} onSection={(s) => go(s)}>
      {notice && (
        <div className="mb-4">
          <Notice tone="ok">{notice}</Notice>
        </div>
      )}
      {section === "overview" && <AdminDashboard go={go} />}
      {section === "products" && <ProductsPanel key={filter} open={open} setOpen={setOpen} initialFilter={filter} />}
      {section === "new" && (
        <section className="paper-page rounded-2xl p-5 sm:p-6">
          <AdminProductForm
            base={emptyProduct()}
            mode="create"
            onCreated={(slug) => {
              go("products");
              setOpen(slug);
              setNotice("Товар создан в черновиках. Проверьте его и опубликуйте в разделе «Публикация».");
            }}
          />
        </section>
      )}
      {section === "design" && <DesignPanel />}
      {section === "publish" && <PublishPanel onAccount={() => go("account")} />}
      {section === "sheet" && <SheetPanel />}
      {section === "account" && <AccountPanel />}
      {section === "help" && <HelpPanel />}
    </AdminShell>
  );
}

function HelpPanel() {
  const steps = [
    ["Вход", "Логин и пароль вы придумали сами при первом входе. Пароль нигде не хранится: им зашифрован ключ GitHub на этом устройстве. Без галочки «Оставаться в системе» кабинет закрывается после 30 минут бездействия."],
    ["Изменить карточку", "«Товары» → нажмите на товар → правьте поля → «Сохранить». Изменения сразу видны вам, но не покупателям."],
    ["Фото товара", "В карточке: «Выбрать фото с компьютера» или перетащите файлы JPEG или PNG. ★ — обложка, ← → — порядок, × — удалить."],
    ["Картинки сайта", "«Оформление» → у нужного места «Заменить» → выберите JPEG или PNG. Картинка уменьшится и сожмётся сама. «Вернуть исходную» — снова картинка из брошюры."],
    ["Баннеры", "«Оформление» → «Добавить баннер»: картинка, описание, заголовок, текст и ссылка. Баннеры показываются на главной под первым экраном."],
    ["Новый товар", "«Новый товар» → название, раздел, цена → «Создать товар». Адрес страницы заполнится сам."],
    ["Снять с продажи", "Кнопка «Скрыть» в списке или галочка «Снять с витрины» в карточке. Товар пропадёт из каталога, но не удалится."],
    ["Много правок сразу", "«Таблица Excel»: скачать → поправить цены или ссылки → загрузить обратно."],
    ["Показать всем", "«Публикация» → «Опубликовать». Через 2–3 минуты сайт обновится. История всех версий хранится в GitHub."],
  ];
  return (
    <section className="paper-page rounded-2xl p-5 sm:p-6">
      <ol className="space-y-4">
        {steps.map(([title, text], i) => (
          <li key={title} className="flex gap-4">
            <span className="font-display text-3xl leading-none text-brand-crimson">{i + 1}</span>
            <span>
              <span className="block font-serif text-lg font-bold text-brand-green">{title}</span>
              <span className="text-sm leading-relaxed text-brand-green/85">{text}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-sm text-brand-green/75">
        Черновики живут только в этом браузере. Если работаете с двух устройств — публикуйте перед переходом на другое.
      </p>
    </section>
  );
}
