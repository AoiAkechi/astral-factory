import type { Character, CharacterAffinity, CharacterRarity } from "../types";
import {
  CHARACTER_ICON_POOL,
  CHARACTER_NAME_POOL,
  RARITY_TABLE,
} from "../data/characters";

const AFFINITIES: CharacterAffinity[] = ["mining", "power", "delivery", "research"];

function weightedPick<T extends string>(table: Record<T, { weight: number }>): T {
  const entries = Object.entries(table) as [T, { weight: number }][];
  const total = entries.reduce((sum, [, v]) => sum + v.weight, 0);
  let roll = Math.random() * total;
  for (const [key, v] of entries) {
    roll -= v.weight;
    if (roll <= 0) return key;
  }
  return entries[entries.length - 1][0];
}

function randomInRange(min: number, max: number): number {
  return Math.round(min + Math.random() * (max - min));
}

/**
 * ガチャ1回分の抽選。
 * ① レア度を重み抽選 → ② レア度の範囲内で各適性の「潜在値(potential)」をロール。
 * これが厳選の「種」であり、その後の調練（工業工程）で確定ステータスへ変換される。
 */
export function rollCharacter(): Character {
  const rarity: CharacterRarity = weightedPick(RARITY_TABLE);
  const { min, max } = RARITY_TABLE[rarity];

  const potential: Record<CharacterAffinity, number> = {
    mining: 0,
    power: 0,
    delivery: 0,
    research: 0,
  };
  for (const a of AFFINITIES) {
    potential[a] = randomInRange(min, max);
  }

  const name =
    CHARACTER_NAME_POOL[Math.floor(Math.random() * CHARACTER_NAME_POOL.length)];
  const icon =
    CHARACTER_ICON_POOL[Math.floor(Math.random() * CHARACTER_ICON_POOL.length)];

  return {
    id: crypto.randomUUID(),
    name,
    icon,
    rarity,
    potential,
    confirmed: { mining: 0, power: 0, delivery: 0, research: 0 },
    temperState: "raw",
    temperProgress: 0,
  };
}
