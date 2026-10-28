/**
 * Иллюстрации из брошюры «Целебные бальзамы Крыма» (public/brochure/).
 * Права на использование акварелей в интернете уточнить у правообладателя.
 */
export interface BrochureImage {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export const COVER: BrochureImage = {
  src: "/brochure/cover-wreath.webp",
  width: 1000,
  height: 1000,
  alt: "Крымское море и скалы в венке из колокольчиков, мака и ромашки — обложка брошюры",
};

export const STAMPS = {
  swallowNest: { src: "/brochure/stamp-swallow-nest.webp", width: 556, height: 368, alt: "Акварель: Ласточкино гнездо" },
  lighthouse: { src: "/brochure/stamp-lighthouse.webp", width: 614, height: 426, alt: "Акварель: храм-маяк на берегу моря" },
  karadag: { src: "/brochure/stamp-karadag.webp", width: 615, height: 438, alt: "Акварель: скалы Карадага" },
  road: { src: "/brochure/stamp-road.webp", width: 560, height: 360, alt: "Акварель: дорога среди крымских холмов" },
  window: { src: "/brochure/stamp-window.webp", width: 354, height: 666, alt: "Акварель: окно с сиренью и видом на море" },
  car: { src: "/brochure/stamp-car.webp", width: 398, height: 578, alt: "Акварель: ретро-автомобиль с чемоданами" },
} satisfies Record<string, BrochureImage>;

/** Вступление брошюры (с. 2) — дословно. */
export const BROCHURE_INTRO = [
  "«Фитон Крым» представляет серию из двадцати пяти жировых кремов «Крымский бальзам», изготовленных на основе растительных масел и восков, с высоким содержанием биологически активных экстрактов и эфирных масел.",
  "Рецептуры бальзамов опираются на фармакопейные прописи, собраны в соответствии с базовыми концепциями натуропатии, арома- и фитотерапии. В использовании они экономичны, так как требуют минимального количества при нанесении, хорошо комбинируются с современной декоративной и оздоровительной косметикой.",
];

export const BROCHURE_CREDO =
  "Мы искренне верим в неограниченные возможности натуральной фитокосметики и знаем, что здоровье достижимо лишь в гармонии с природой, а красота — это искусство, для овладения которым нужны знания, вера и терпение.";

export const SLOGAN = "шедевры натуральной косметики";
