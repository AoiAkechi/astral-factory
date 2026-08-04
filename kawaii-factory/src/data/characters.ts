import type { CharacterRarity } from "../types";

export const GACHA_CRYSTAL_COST = 3;

// レア度ごとの抽選重み、及び潜在値(potential)のロール範囲
export const RARITY_TABLE: Record<
  CharacterRarity,
  { weight: number; min: number; max: number; label: string }
> = {
  common: { weight: 60, min: 20, max: 55, label: "コモン" },
  rare: { weight: 28, min: 40, max: 70, label: "レア" },
  epic: { weight: 10, min: 60, max: 85, label: "エピック" },
  legend: { weight: 2, min: 80, max: 100, label: "レジェンド" },
};

export const CHARACTER_NAME_POOL = [
  "コハク",
  "モモ",
  "スミレ",
  "ヒバリ",
  "クルミ",
  "アカネ",
  "ツバキ",
  "ユキ",
  "リン",
  "サクラ",
];

export const CHARACTER_ICON_POOL = ["🦊", "🐰", "🐿️", "🦉", "🐻", "🐨", "🐺", "🐱"];

// 調練1回あたりの進行度とコスト。厳選対象①の「仕上げ工程」。
export const TEMPER_DURATION_SECONDS = 8;
export const TEMPER_COST = { gald: 30, wood: 15 };
