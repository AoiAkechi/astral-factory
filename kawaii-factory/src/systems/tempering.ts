import type { Character, CharacterAffinity } from "../types";

const AFFINITIES: CharacterAffinity[] = ["mining", "power", "delivery", "research"];

/**
 * 調練完了時に「潜在値(potential)」を「確定値(confirmed)」に変換する。
 * 潜在値を上限としつつ、±8%程度の工業的なブレを与える
 * （良い種を引いても仕上げに完全成功するとは限らない、という緊張感）。
 * これが「RNGで種を引き、決定論的工程で仕上げる」の最終ステップ。
 */
export function confirmCharacterStats(character: Character): Character {
  const confirmed: Record<CharacterAffinity, number> = {
    mining: 0,
    power: 0,
    delivery: 0,
    research: 0,
  };

  for (const a of AFFINITIES) {
    const potential = character.potential[a];
    const variance = 1 - 0.08 + Math.random() * 0.08; // 0.92 〜 1.00
    confirmed[a] = Math.round(potential * variance);
  }

  return {
    ...character,
    confirmed,
    temperState: "confirmed",
    temperProgress: 1,
  };
}
