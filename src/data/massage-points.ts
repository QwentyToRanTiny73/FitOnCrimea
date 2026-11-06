/**
 * Схема «Акупунктурные точки для массажа с Крымским бальзамом» (public/massage-points.jpg).
 *
 * Источники:
 * - indications — дословно из брошюры бренда;
 * - where, label, dots — положение на рисунке (координаты в % от ширины и высоты картинки);
 * - balms — бальзамы, в показаниях которых есть то же состояние (совпадение слов, не рекомендация брошюры);
 * - TECHNIQUE и ZONE_TIPS — общие правила точечного массажа, в брошюре их НЕТ.
 *   Перед публичным запуском согласовать со специалистом.
 */

export type Zone = "head" | "neck" | "chest" | "back" | "arms" | "legs";

export type Caution = "urgent" | "doctor";

export interface MassagePoint {
  n: number;
  indications: string;
  where: string;
  zone: Zone;
  /** Центры номеров на схеме; у точки 16 их два. */
  labels: Array<[x: number, y: number]>;
  /** Места на теле, куда ведут линии от номера. */
  dots: Array<[x: number, y: number]>;
  caution?: Caution;
  balms?: string[];
  /** Номер на исходной схеме почти не виден — показываем свой. */
  faint?: boolean;
}

export const MASSAGE_POINTS: MassagePoint[] = [
  { n: 1, indications: "ринит, насморк, головная боль, ОРВИ, гипертонический криз", where: "Лицо, у крыла носа", zone: "head", labels: [[34.2, 4.5]], dots: [[27.2, 8.7], [30, 10]], caution: "urgent", balms: ["ot-nasmorka", "chabretsovaya-zvezdochka", "zvezda-kryma"] },
  { n: 2, indications: "гипертония, бессонница, атеросклероз", where: "Шея сбоку, под ухом", zone: "neck", labels: [[39, 6.8]], dots: [[33.9, 10.7]], caution: "doctor", balms: ["uspokoitelnyy"] },
  { n: 3, indications: "метеочувствительность, стресс, переутомление", where: "Основание шеи и надплечья, сзади", zone: "neck", labels: [[42.1, 9.3]], dots: [[45.7, 13.1], [49.7, 10.7], [52.1, 14]], balms: ["uspokoitelnyy"] },
  { n: 4, indications: "зубная боль, боль в ухе", where: "Около уха", zone: "head", labels: [[61.7, 5.2]], dots: [[54.3, 10.3], [67.2, 9.6]] },
  { n: 5, indications: "спазматический кашель, астма", where: "Висок", zone: "head", labels: [[66.4, 5.2]], dots: [[68.6, 8.2]], balms: ["ot-kashlya", "chabretsovaya-zvezdochka"] },
  { n: 6, indications: "ангина, боль в горле", where: "Шея спереди, у основания горла", zone: "neck", labels: [[61.7, 11.3]], dots: [[68.5, 12.9]], balms: ["chabretsovaya-zvezdochka"] },
  { n: 7, indications: "слабость иммунной системы", where: "Грудь, по центру", zone: "chest", labels: [[74, 13.6]], dots: [[68.4, 14.9], [69.3, 19.3]] },
  { n: 8, indications: "глазная боль, перевозбуждение", where: "Кисть руки", zone: "arms", labels: [[81.7, 17.2]], dots: [[75.7, 16.9]] },
  { n: 9, indications: "меланхолия, бессонница", where: "Предплечье", zone: "arms", labels: [[80.6, 20]], dots: [[74.2, 18.7], [78, 24.4]], balms: ["uspokoitelnyy"] },
  { n: 10, indications: "гипотония", where: "Ладонь", zone: "arms", labels: [[92.2, 24.3]], dots: [[88.8, 21.2]], caution: "doctor" },
  { n: 11, indications: "боль в области сердца", where: "Запястье", zone: "arms", labels: [[85.1, 26]], dots: [[85.3, 21.7]], caution: "urgent" },
  { n: 12, indications: "тревожность, взволнованность", where: "Голень, ниже колена", zone: "legs", labels: [[61.7, 44.1]], dots: [[66.7, 46]], balms: ["uspokoitelnyy"], faint: true },
  { n: 13, indications: "спазматическая головная боль", where: "Стопа: подъём и пальцы", zone: "legs", labels: [[71.9, 55]], dots: [[64.8, 57.4], [69.8, 59.6]], balms: ["zvezda-kryma", "uspokoitelnyy"] },
  { n: 14, indications: "холецистит, желчная колика", where: "Большой палец стопы", zone: "legs", labels: [[59.5, 63.6]], dots: [[59.5, 59.6]], caution: "urgent" },
  { n: 15, indications: "пояснично-крестцовый радикулит, ишиас", where: "Пятка, сзади", zone: "legs", labels: [[50.3, 65.4]], dots: [[50.3, 61]], balms: ["progrevayushchiy"] },
  { n: 16, indications: "половая слабость, поясничная боль", where: "Поясница и икра", zone: "back", labels: [[40.7, 32.6], [58.3, 48.5]], dots: [[47.1, 27.5], [52.3, 27.1], [51.8, 48.7]] },
  { n: 17, indications: "раздражительность, истерия, бессонница", where: "Подошва стопы", zone: "legs", labels: [[29.6, 63.5]], dots: [[36.2, 62.1]], balms: ["uspokoitelnyy"] },
  { n: 18, indications: "стенокардия, боль в животе, расстройство месячных циклов", where: "Живот, ниже пупка", zone: "chest", labels: [[17.4, 29.5]], dots: [[29.7, 28.2]], caution: "urgent" },
  { n: 19, indications: "переутомление, слабое внимание", where: "Запястье", zone: "arms", labels: [[13.1, 25.8]], dots: [[13.3, 21.8]] },
  { n: 20, indications: "онемение рук, слабость", where: "Кисть руки", zone: "arms", labels: [[13, 17.8]], dots: [[10.5, 19.5]] },
  { n: 21, indications: "шейный остеохондроз", where: "Плечо, сверху", zone: "neck", labels: [[21.9, 12.4]], dots: [[24.8, 14.3]], balms: ["progrevayushchiy", "obezbolivayushchiy"] },
  { n: 22, indications: "избыточный вес", where: "Плечо, наружная сторона", zone: "arms", labels: [[39.8, 23.9]], dots: [[37.3, 17.5]], balms: ["anticellyulitnyy"] },
  { n: 23, indications: "межрёберная невралгия", where: "Спина, на уровне лопаток", zone: "back", labels: [[57.8, 21.9]], dots: [[46.4, 16.7], [51, 16.9]], balms: ["obezbolivayushchiy", "zdorovye-sustavy"] },
  { n: 24, indications: "радикулит", where: "Середина спины", zone: "back", labels: [[40.3, 26.9]], dots: [[48.9, 23.5]], balms: ["progrevayushchiy"] },
  { n: 25, indications: "боль в локтевом суставе", where: "Локоть", zone: "arms", labels: [[59.1, 24.4]], dots: [[66, 22.1]], balms: ["zvezda-kryma", "progrevayushchiy"] },
  { n: 26, indications: "атеросклероз", where: "Макушка", zone: "head", labels: [[58.9, 4]], dots: [[55.7, 4.6]], caution: "doctor" },
];

export const ZONE_LABELS: Record<Zone, string> = {
  head: "Голова и лицо",
  neck: "Шея и плечи",
  chest: "Грудь и живот",
  back: "Спина",
  arms: "Руки",
  legs: "Ноги и стопы",
};

/** Общая методика (не из брошюры). */
export const TECHNIQUE: string[] = [
  "Перед первым применением проверьте переносимость: немного бальзама на сгиб локтя, подождите сутки.",
  "Возьмите на кончик пальца совсем немного бальзама — он экономичен.",
  "Найдите точку по схеме и мягко надавите подушечкой пальца.",
  "Массируйте круговыми движениями 1–2 минуты: давление ощутимое, но не болезненное.",
  "Парные точки массируйте с обеих сторон тела.",
  "Повторяйте 1–3 раза в день. Если неприятно или кожа покраснела — прекратите.",
];

/** Особенности по зонам (общие правила, не из брошюры). */
export const ZONE_TIPS: Record<Zone, string> = {
  head: "Самая малая доза и лёгкое касание. Не наносите близко к глазам и на слизистые; прогревающие бальзамы на лицо не используйте.",
  neck: "Мягкие круговые движения. Переднюю поверхность шеи не продавливайте — только поглаживание.",
  chest: "Лёгкие круговые движения по часовой стрелке, без сильного нажима.",
  back: "Втирайте бальзам ладонью или подушечками пальцев рядом с позвоночником, не на него. Удобнее, если поможет другой человек.",
  arms: "Можно надавливать сильнее: разминайте точку большим пальцем другой руки.",
  legs: "Разминайте большим пальцем с ощутимым давлением. Не массируйте поверх варикозных вен.",
};

export const CAUTION_TEXT: Record<Caution, string> = {
  urgent:
    "Острое состояние: сначала вызовите врача — 103 или 112. Массаж точки не заменяет медицинскую помощь.",
  doctor: "Хроническое состояние: массаж — только дополнение к лечению, которое назначил врач.",
};

/** Быстрые фильтры по симптомам. */
export const SYMPTOM_FILTERS: Array<{ label: string; words: string[] }> = [
  { label: "Простуда и горло", words: ["ринит", "насморк", "орви", "ангин", "горл", "кашел"] },
  { label: "Головная боль", words: ["головная боль"] },
  { label: "Сон и нервы", words: ["бессонниц", "стресс", "тревожн", "раздражит", "истери", "меланхол", "перевозбужд"] },
  { label: "Спина и суставы", words: ["радикулит", "остеохондроз", "невралги", "поясничн", "сустав", "ишиас"] },
  { label: "Усталость", words: ["переутомл", "слабост", "внимани"] },
  { label: "Давление и сердце", words: ["гипертон", "гипотон", "сердц", "стенокард", "атеросклероз"] },
];
