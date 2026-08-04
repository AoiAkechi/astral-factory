import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  BuildingId,
  BuildingState,
  Character,
  ExploreLogEntry,
  ResourceKey,
  ResourceMap,
} from "../types";
import { BUILDINGS, BUILDING_MAP } from "../data/buildings";
import { RESEARCH_MAP } from "../data/research";
import {
  DUNGEON_DROPS,
  EXPLORE_COOLDOWN_SECONDS,
  EXPLORE_FLAVOR_TEXTS,
} from "../data/dungeon";
import { GACHA_CRYSTAL_COST, TEMPER_COST, TEMPER_DURATION_SECONDS } from "../data/characters";
import { addResources, advanceBuilding, canAfford, payCost } from "../systems/tick";
import { rollCharacter } from "../systems/gacha";
import { confirmCharacterStats } from "../systems/tempering";

const INITIAL_RESOURCES: ResourceMap = {
  wood: 20,
  wheat: 5,
  flour: 0,
  bread: 0,
  ore: 0,
  crystal: 0,
  gald: 10,
  happiness: 0,
};

function initialBuildings(): Record<BuildingId, BuildingState> {
  const entries = BUILDINGS.map((b) => [
    b.id,
    {
      id: b.id,
      level: 1,
      unlocked: !b.requiresResearch,
      progress: 0,
    } as BuildingState,
  ]);
  return Object.fromEntries(entries) as Record<BuildingId, BuildingState>;
}

interface GameState {
  resources: ResourceMap;
  buildings: Record<BuildingId, BuildingState>;
  research: Record<string, boolean>;
  characters: Character[];
  exploreCooldown: number;
  logs: ExploreLogEntry[];

  tick: (deltaSeconds: number) => void;
  explore: () => void;
  unlockResearch: (id: string) => void;
  upgradeBuilding: (id: BuildingId) => void;
  assignCharacter: (buildingId: BuildingId, characterId: string | undefined) => void;
  pullGacha: () => void;
  startTemper: (characterId: string) => void;
  resetSave: () => void;
}

function pushLog(logs: ExploreLogEntry[], message: string): ExploreLogEntry[] {
  const entry: ExploreLogEntry = {
    id: crypto.randomUUID(),
    message,
    timestamp: Date.now(),
  };
  const next = [...logs, entry];
  return next.slice(-30); // 直近30件だけ保持
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      resources: { ...INITIAL_RESOURCES },
      buildings: initialBuildings(),
      research: {},
      characters: [],
      exploreCooldown: 0,
      logs: [],

      tick: (deltaSeconds) => {
        const state = get();
        const flags = {
          farmSpeedUp: !!state.research["research_farm2"],
          happinessBoost: !!state.research["research_happiness"],
        };

        let resources = state.resources;
        const buildings = { ...state.buildings };
        for (const id of Object.keys(buildings) as BuildingId[]) {
          const result = advanceBuilding(
            buildings[id],
            resources,
            state.characters,
            deltaSeconds,
            flags
          );
          buildings[id] = result.building;
          resources = result.resources;
        }

        // 調練の進行
        let charactersChanged = false;
        const characters = state.characters.map((c) => {
          if (c.temperState !== "tempering") return c;
          charactersChanged = true;
          const progress = c.temperProgress + deltaSeconds / TEMPER_DURATION_SECONDS;
          if (progress >= 1) {
            return confirmCharacterStats(c);
          }
          return { ...c, temperProgress: progress };
        });

        const exploreCooldown = Math.max(0, state.exploreCooldown - deltaSeconds);

        set({
          resources,
          buildings,
          exploreCooldown,
          ...(charactersChanged ? { characters } : {}),
        });
      },

      explore: () => {
        const state = get();
        if (state.exploreCooldown > 0) return;

        const totalWeight = DUNGEON_DROPS.reduce((s, d) => s + d.weight, 0);
        let roll = Math.random() * totalWeight;
        const drop = DUNGEON_DROPS.find((d) => {
          roll -= d.weight;
          return roll <= 0;
        }) ?? DUNGEON_DROPS[0];

        const effBonus = state.research["research_dungeon_eff"] ? 1.5 : 1;
        const amount = Math.round(
          (drop.min + Math.random() * (drop.max - drop.min)) * effBonus
        );

        const resources = addResources(state.resources, {
          [drop.key as ResourceKey]: amount,
        });

        const flavor =
          EXPLORE_FLAVOR_TEXTS[Math.floor(Math.random() * EXPLORE_FLAVOR_TEXTS.length)];
        const message = `${flavor}（${drop.key} +${amount}）`;

        set({
          resources,
          exploreCooldown: EXPLORE_COOLDOWN_SECONDS,
          logs: pushLog(state.logs, message),
        });
      },

      unlockResearch: (id) => {
        const state = get();
        const node = RESEARCH_MAP[id];
        if (!node) return;
        if (state.research[id]) return;
        const requiresOk = node.requires.every((r) => state.research[r]);
        if (!requiresOk) return;
        if (!canAfford(state.resources, node.cost)) return;

        const resources = payCost(state.resources, node.cost);
        const research = { ...state.research, [id]: true };

        // 建物アンロック連動
        const buildings = { ...state.buildings };
        for (const b of BUILDINGS) {
          if (b.requiresResearch === id) {
            buildings[b.id] = { ...buildings[b.id], unlocked: true };
          }
        }

        set({ resources, research, buildings });
      },

      upgradeBuilding: (id) => {
        const state = get();
        const building = state.buildings[id];
        const def = BUILDING_MAP[id];
        if (!building.unlocked) return;
        const cost = def.upgradeCost(building.level);
        if (!canAfford(state.resources, cost)) return;

        const resources = payCost(state.resources, cost);
        const buildings = {
          ...state.buildings,
          [id]: { ...building, level: building.level + 1 },
        };
        set({ resources, buildings });
      },

      assignCharacter: (buildingId, characterId) => {
        const state = get();
        const prevAssigned = state.buildings[buildingId].assignedCharacterId;

        const characters = state.characters.map((c) => {
          if (c.id === prevAssigned) return { ...c, assignedBuildingId: undefined };
          if (c.id === characterId) return { ...c, assignedBuildingId: buildingId };
          return c;
        });

        const buildings = {
          ...state.buildings,
          [buildingId]: {
            ...state.buildings[buildingId],
            assignedCharacterId: characterId,
          },
        };

        set({ characters, buildings });
      },

      pullGacha: () => {
        const state = get();
        if (!state.research["research_gacha"]) return;
        const cost = { crystal: GACHA_CRYSTAL_COST };
        if (!canAfford(state.resources, cost)) return;

        const resources = payCost(state.resources, cost);
        const character = rollCharacter();
        set({
          resources,
          characters: [...state.characters, character],
          logs: pushLog(
            state.logs,
            `新しい仲間「${character.name}」が現れた！（${character.rarity}）`
          ),
        });
      },

      startTemper: (characterId) => {
        const state = get();
        if (!state.research["research_temper"]) return;
        const character = state.characters.find((c) => c.id === characterId);
        if (!character || character.temperState !== "raw") return;
        if (!canAfford(state.resources, TEMPER_COST)) return;

        const resources = payCost(state.resources, TEMPER_COST);
        const characters = state.characters.map((c) =>
          c.id === characterId
            ? { ...c, temperState: "tempering" as const, temperProgress: 0 }
            : c
        );
        set({ resources, characters });
      },

      resetSave: () => {
        set({
          resources: { ...INITIAL_RESOURCES },
          buildings: initialBuildings(),
          research: {},
          characters: [],
          exploreCooldown: 0,
          logs: [],
        });
      },
    }),
    { name: "kawaii-factory-save" }
  )
);
