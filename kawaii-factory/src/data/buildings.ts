import type { BuildingDef } from "../types";

// 生産チェーン: 畑(小麦) -> 水車(小麦粉) -> パン工房(パン) -> 配送(ゴールド+幸福度)
export const BUILDINGS: BuildingDef[] = [
  {
    id: "farm",
    name: "開拓の畑",
    icon: "🌾",
    description: "何もないところから小麦を育てる、村の生産の出発点。",
    consumes: {},
    produces: { wheat: 1 },
    cycleSeconds: 3,
    affinity: "mining",
    upgradeCost: (level) => ({ wood: 8 * level }),
  },
  {
    id: "mill",
    name: "水車小屋",
    icon: "⚙️",
    description: "小麦を挽いて小麦粉にする。村最初の「機械」。",
    consumes: { wheat: 2 },
    produces: { flour: 1 },
    cycleSeconds: 4,
    affinity: "power",
    requiresResearch: "research_mill",
    upgradeCost: (level) => ({ wood: 10 * level, wheat: 4 * level }),
  },
  {
    id: "bakery",
    name: "パン工房",
    icon: "🍞",
    description: "小麦粉を焼き上げてパンにする。香りが村中に広がる。",
    consumes: { flour: 2 },
    produces: { bread: 1 },
    cycleSeconds: 5,
    affinity: "power",
    requiresResearch: "research_bakery",
    upgradeCost: (level) => ({ wood: 12 * level, flour: 4 * level }),
  },
  {
    id: "delivery",
    name: "配送ステーション",
    icon: "🚚",
    description: "パンを村人に届ける。ゴールドと幸福度に変換される。",
    consumes: { bread: 2 },
    produces: { gald: 3, happiness: 1 },
    cycleSeconds: 5,
    affinity: "delivery",
    requiresResearch: "research_delivery",
    upgradeCost: (level) => ({ wood: 14 * level, bread: 4 * level }),
  },
];

export const BUILDING_MAP: Record<string, BuildingDef> = Object.fromEntries(
  BUILDINGS.map((b) => [b.id, b])
);
