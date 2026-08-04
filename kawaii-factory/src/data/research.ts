import type { ResearchNode } from "../types";

// MVPでは8ノードのみ。将来的に案6の「数千ノード」に拡張する際は
// カテゴリ(材料/生体/物流/開拓) x ティア のマトリクスをこの配列に追加していく想定。
export const RESEARCH_TREE: ResearchNode[] = [
  {
    id: "research_mill",
    name: "水車の設計図",
    description: "小麦を小麦粉に変える水車小屋を建設できるようにする。",
    cost: { wood: 20, wheat: 10 },
    requires: [],
    effect: "「水車小屋」を建設可能",
  },
  {
    id: "research_bakery",
    name: "パン窯の設計図",
    description: "小麦粉を焼いてパンにする工房を建設できるようにする。",
    cost: { wood: 30, flour: 10 },
    requires: ["research_mill"],
    effect: "「パン工房」を建設可能",
  },
  {
    id: "research_delivery",
    name: "配送路の整備",
    description: "パンを村人へ届け、ゴールドと幸福度に変換する仕組みを作る。",
    cost: { wood: 40, bread: 10 },
    requires: ["research_bakery"],
    effect: "「配送ステーション」を建設可能",
  },
  {
    id: "research_gacha",
    name: "妖精の勧誘",
    description: "森の妖精結晶を使って、新しい仲間を勧誘できるようにする。",
    cost: { crystal: 3 },
    requires: [],
    effect: "仲間ガチャ（勧誘）を解禁",
  },
  {
    id: "research_temper",
    name: "調練工房",
    description: "勧誘した仲間の潜在能力を「調練」で確定ステータスに仕上げる。",
    cost: { gald: 50, wood: 20 },
    requires: ["research_gacha"],
    effect: "仲間の調練（厳選の仕上げ工程）を解禁",
  },
  {
    id: "research_farm2",
    name: "畑の拡張",
    description: "畑の生産速度を高める灌漑技術。",
    cost: { wood: 25, wheat: 15 },
    requires: [],
    effect: "畑のサイクル時間を短縮",
  },
  {
    id: "research_dungeon_eff",
    name: "探索装備の改良",
    description: "軽量な探索装備で、森からの採取効率を上げる。",
    cost: { wood: 30, ore: 10 },
    requires: [],
    effect: "ダンジョン探索の報酬量アップ",
  },
  {
    id: "research_happiness",
    name: "村祭りの開催",
    description: "村の幸福度上昇量を増やす特別な祭り。",
    cost: { gald: 80, happiness: 20 },
    requires: ["research_delivery"],
    effect: "幸福度の獲得量が増加",
  },
];

export const RESEARCH_MAP: Record<string, ResearchNode> = Object.fromEntries(
  RESEARCH_TREE.map((r) => [r.id, r])
);
