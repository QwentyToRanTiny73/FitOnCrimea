/**
 * Подготовка картинок из кабинета: проверка формата, уменьшение до нужного
 * размера и сжатие прямо в браузере, до публикации.
 *
 * JPEG → JPEG. PNG с прозрачностью → PNG (прозрачный фон сохраняется),
 * PNG без прозрачности → JPEG (в 3–10 раз легче). WebP тоже принимается.
 */

export const ACCEPT_ATTR = "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp";
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_MB = 20;

export interface PreparedImage {
  dataUrl: string;
  width: number;
  height: number;
  type: "image/jpeg" | "image/png";
  /** Размер после сжатия, байт. */
  bytes: number;
  sourceWidth: number;
  sourceHeight: number;
}

export function checkImageFile(file: File): void {
  const byExt = /\.(jpe?g|png|webp)$/i.test(file.name);
  if (!ACCEPTED.includes(file.type) && !byExt) {
    throw new Error(`«${file.name}»: нужен файл JPEG или PNG.`);
  }
  if (file.size > MAX_FILE_MB * 1024 * 1024) {
    throw new Error(`«${file.name}»: файл больше ${MAX_FILE_MB} МБ. Уменьшите его перед загрузкой.`);
  }
}

export async function prepareImage(file: File, { maxSide, quality = 0.85 }: { maxSide: number; quality?: number }): Promise<PreparedImage> {
  if (typeof window === "undefined") throw new Error("prepareImage работает только в браузере");
  checkImageFile(file);

  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url, file.name);
    const ratio = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.max(1, Math.round(img.naturalWidth * ratio));
    const h = Math.max(1, Math.round(img.naturalHeight * ratio));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Браузер не умеет обрабатывать картинки (нет Canvas).");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, w, h);

    const transparent = file.type !== "image/jpeg" && hasTransparency(ctx, w, h);
    let dataUrl: string;
    let type: PreparedImage["type"];
    if (transparent) {
      dataUrl = canvas.toDataURL("image/png");
      type = "image/png";
    } else {
      // JPEG не умеет прозрачность — подкладываем белый фон.
      ctx.globalCompositeOperation = "destination-over";
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      dataUrl = canvas.toDataURL("image/jpeg", quality);
      type = "image/jpeg";
    }
    const bytes = Math.round(((dataUrl.length - dataUrl.indexOf(",") - 1) * 3) / 4);
    return { dataUrl, width: w, height: h, type, bytes, sourceWidth: img.naturalWidth, sourceHeight: img.naturalHeight };
  } finally {
    URL.revokeObjectURL(url);
  }
}

function hasTransparency(ctx: CanvasRenderingContext2D, w: number, h: number): boolean {
  try {
    const { data } = ctx.getImageData(0, 0, w, h);
    const step = Math.max(1, Math.floor((w * h) / 200_000)) * 4;
    for (let i = 3; i < data.length; i += step) if (data[i] < 250) return true;
    return false;
  } catch {
    return false;
  }
}

function loadImage(src: string, name: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`«${name}»: не удалось прочитать картинку. Файл повреждён или это не JPEG/PNG.`));
    img.src = src;
  });
}

export const formatBytes = (bytes: number): string =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} КБ` : `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} МБ`;
