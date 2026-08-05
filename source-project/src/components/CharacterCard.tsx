import type { Character } from "../types";
import { useGameStore } from "../state/store";
import { formatCost } from "../data/resourceMeta";
import { TEMPER_COST } from "../data/characters";

const AFFINITY_LABEL: Record<string, string> = {
  mining: "採掘",
  power: "動力",
  delivery: "配送",
  research: "研究",
};

export function CharacterCard({ character }: { character: Character }) {
  const startTemper = useGameStore((s) => s.startTemper);
  const temperUnlocked = useGameStore((s) => !!s.research["research_temper"]);
  const resources = useGameStore((s) => s.resources);

  const canAffordTemper = Object.entries(TEMPER_COST).every(
    ([k, v]) => resources[k as keyof typeof resources] >= (v ?? 0)
  );

  const statSource = character.temperState === "confirmed" ? character.confirmed : character.potential;

  return (
    <div className="card">
      <div className="card__title">
        {character.icon} {character.name}
        <span className={`tag rarity-${character.rarity === "legend" ? "legend" : character.rarity}`}>
          {character.rarity}
        </span>
      </div>

      {Object.entries(statSource).map(([affinity, value]) => (
        <div className="card__row" key={affinity}>
          <span>{AFFINITY_LABEL[affinity]}</span>
          <span>
            {character.temperState === "confirmed" ? value : `潜在 ${value}`}
          </span>
        </div>
      ))}

      {character.temperState === "raw" && (
        <button
          className="btn plum"
          disabled={!temperUnlocked || !canAffordTemper}
          onClick={() => startTemper(character.id)}
        >
          {temperUnlocked
            ? `調練する（${formatCost(TEMPER_COST)}）`
            : "研究タブで調練工房を解放"}
        </button>
      )}

      {character.temperState === "tempering" && (
        <>
          <div className="progress">
            <div
              className="progress__fill plum"
              style={{ width: `${character.temperProgress * 100}%` }}
            />
          </div>
          <div className="card__desc">調練中…潜在能力を確定ステータスへ仕上げている</div>
        </>
      )}

      {character.temperState === "confirmed" && (
        <div className="card__desc">
          {character.assignedBuildingId
            ? `「工場」タブで配属中`
            : "調練完了。工場タブで配属できる"}
        </div>
      )}
    </div>
  );
}
