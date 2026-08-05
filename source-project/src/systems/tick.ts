import { BUILDING_MAP } from "../data/buildings";
import type {
  BuildingState,
  Character,
  ResourceKey,
  ResourceMap,
} from "../types";

/** 資源がすべて足りているか判定するヘルパー */
export function canAfford(
  resources: ResourceMap,
  cost: Partial<ResourceMap>
): boolean {
  return Object.entries(cost).every(
    ([key, amount]) => resources[key as ResourceKey] >= (amount ?? 0)
  );
}

export function payCost(
  resources: ResourceMap,
  cost: Partial<ResourceMap>
): ResourceMap {
  const next = { ...resources };
  for (const [key, amount] of Object.entries(cost)) {
    next[key as ResourceKey] -= amount ?? 0;
  }
  return next;
}

export function addResources(
  resources: ResourceMap,
  gain: Partial<ResourceMap>
): ResourceMap {
  const next = { ...resources };
  for (const [key, amount] of Object.entries(gain)) {
    next[key as ResourceKey] = (next[key as ResourceKey] ?? 0) + (amount ?? 0);
  }
  return next;
}

interface TickResearchFlags {
  farmSpeedUp: boolean; // research_farm2
  happinessBoost: boolean; // research_happiness
}

/**
 * 配属キャラの確定ステータスから生産ボーナス倍率を算出する。
 * confirmed(0-100) の適性値がそのまま出力の+0%〜+50%になる。
 * まだ調練が終わっていない(raw/tempering)キャラは0ボーナス
 * → 「引いただけでは強くない、工業工程を通して初めて活きる」という設計。
 */
function getCharacterBonus(
  character: Character | undefined,
  affinity: string
): number {
  if (!character || character.temperState !== "confirmed") return 0;
  const stat = (character.confirmed as Record<string, number>)[affinity] ?? 0;
  return (stat / 100) * 0.5;
}

/**
 * 建物1つを deltaSeconds 分進める。
 * サイクルが完了した場合のみ資源を消費/生産する（消費資源が足りない場合は
 * progressを1で待機させ、「原料待ち」の状態を表現する）。
 */
export function advanceBuilding(
  building: BuildingState,
  resources: ResourceMap,
  characters: Character[],
  deltaSeconds: number,
  flags: TickResearchFlags
): { building: BuildingState; resources: ResourceMap } {
  const def = BUILDING_MAP[building.id];
  if (!building.unlocked) return { building, resources };

  let cycleSeconds = def.cycleSeconds;
  if (building.id === "farm" && flags.farmSpeedUp) {
    cycleSeconds *= 0.7;
  }

  let progress = building.progress + deltaSeconds / cycleSeconds;
  let nextResources = resources;

  while (progress >= 1) {
    const scaledConsume: Partial<ResourceMap> = {};
    for (const [k, v] of Object.entries(def.consumes)) {
      scaledConsume[k as ResourceKey] = (v ?? 0) * building.level;
    }

    if (!canAfford(nextResources, scaledConsume)) {
      // 原料が足りない → 100%で待機（無限ループ防止のため break）
      progress = 1;
      break;
    }

    nextResources = payCost(nextResources, scaledConsume);

    const character = characters.find((c) => c.id === building.assignedCharacterId);
    const bonus = getCharacterBonus(character, def.affinity);

    const scaledProduce: Partial<ResourceMap> = {};
    for (const [k, v] of Object.entries(def.produces)) {
      let amount = (v ?? 0) * building.level * (1 + bonus);
      if (
        (k as ResourceKey) === "happiness" &&
        flags.happinessBoost
      ) {
        amount *= 1.5;
      }
      scaledProduce[k as ResourceKey] = amount;
    }
    nextResources = addResources(nextResources, scaledProduce);

    progress -= 1;
  }

  return {
    building: { ...building, progress },
    resources: nextResources,
  };
}
