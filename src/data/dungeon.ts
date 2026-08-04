import type { DungeonDropTable } from "../types";

export const DUNGEON_NAME = "はじまりの森";

export const EXPLORE_COOLDOWN_SECONDS = 3;

// weight の合計に対する比率で抽選する。character_shard は仲間ガチャの種になる
// 「妖精結晶」の元。将来的にダンジョンを増やす際は配列を追加するだけで拡張できる。
export const DUNGEON_DROPS: DungeonDropTable[] = [
  { key: "wood", weight: 45, min: 2, max: 6 },
  { key: "ore", weight: 30, min: 1, max: 4 },
  { key: "wheat", weight: 15, min: 1, max: 3 },
  { key: "crystal", weight: 10, min: 1, max: 1 },
];

export const EXPLORE_FLAVOR_TEXTS = [
  "森の奥でキノコの群生を見つけた。",
  "小さな獣人の足跡を追ってみる。",
  "苔むした岩の下に何かが眠っていた。",
  "風が運んできた甘い匂いをたどる。",
  "古い切り株の中から鉱石を掘り出した。",
  "きらめく結晶を拾い上げた——妖精の気配がする。",
];
