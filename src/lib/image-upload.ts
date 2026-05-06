export async function fileToCompressedDataURL(
  file: File,
  maxSize = 900,
  quality = 0.82
): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("fileToCompressedDataURL is browser-only");
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("Файл не является изображением.");
  }

  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const ratio = Math.min(1, maxSize / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * ratio));
    const h = Math.max(1, Math.round(img.height * ratio));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context недоступен.");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Не удалось прочитать изображение."));
    img.src = src;
  });
}
