// --- 資源 -----------------------------------------------------------------
export type ResourceKey =
  | "wood" // 木材
  | "wheat" // 小麦
  | "flour" // 小麦粉
  | "bread" // パン
  | "ore" // 鉱石
  | "crystal" // 妖精結晶（ガチャ用）
  | "gald" // ゴールド
  | "happiness"; // 幸福度

export type ResourceMap = Record<ResourceKey, number>;

// --- 建物（生産チェーン） ---------------------------------------------------
export type BuildingId = "farm" | "mill" | "bakery" | "delivery";

export interface BuildingDef {
  id: BuildingId;
  name: string;
  icon: string;
  description: string;
  /** 消費資源（1サイクルあたり）。空なら無から生産（畑など） */
  consumes: Partial<ResourceMap>;
  /** 生産資源（1サイクルあたり、レベル1・仲間なしの基礎値） */
  produces: Partial<ResourceMap>;
  /** サイクル時間（秒） */
  cycleSeconds: number;
  /** 対応する仲間の適性（配属すると生産量ボーナス） */
  affinity: CharacterAffinity;
  /** アンロックに必要な研究ノードID。undefinedなら最初から解放 */
  requiresResearch?: string;
  /** レベルアップコスト（レベル1→2に必要な資源） */
  upgradeCost: (level: number) => Partial<ResourceMap>;
}

export interface BuildingState {
  id: BuildingId;
  level: number;
  unlocked: boolean;
  assignedCharacterId?: string;
  /** 0-1、現在のサイクルの進行度 */
  progress: number;
}

// --- 仲間キャラ（厳選対象①） ------------------------------------------------
export type CharacterAffinity = "mining" | "power" | "delivery" | "research";

export type CharacterRarity = "common" | "rare" | "epic" | "legend";

export interface CharacterStatRoll {
  /** 0-100、各適性の潜在能力（ガチャで決まる「種」） */
  potential: Record<CharacterAffinity, number>;
  rarity: CharacterRarity;
}

export type TemperState = "raw" | "tempering" | "confirmed";

export interface Character {
  id: string;
  name: string;
  icon: string;
  rarity: CharacterRarity;
  /** ガチャ時に決まった潜在値（変化しない「種」） */
  potential: Record<CharacterAffinity, number>;
  /** 調練で確定した実ステータス（tempering完了までnull的に0） */
  confirmed: Record<CharacterAffinity, number>;
  temperState: TemperState;
  /** 調練の進行度 0-1 */
  temperProgress: number;
  assignedBuildingId?: BuildingId;
}

// --- 研究ツリー -------------------------------------------------------------
export interface ResearchNode {
  id: string;
  name: string;
  description: string;
  cost: Partial<ResourceMap>;
  requires: string[]; // 前提ノードID
  effect: string; // 表示用の効果説明
}

export interface ResearchState {
  id: string;
  unlocked: boolean;
}

// --- ダンジョン --------------------------------------------------------------
export interface DungeonDropTable {
  key: ResourceKey | "character_shard";
  weight: number;
  min: number;
  max: number;
}

export interface ExploreLogEntry {
  id: string;
  message: string;
  timestamp: number;
}
