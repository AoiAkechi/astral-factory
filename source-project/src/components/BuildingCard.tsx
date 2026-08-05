import type { BuildingDef, BuildingState, Character } from "../types";
import { useGameStore } from "../state/store";
import { formatCost } from "../data/resourceMeta";

const AFFINITY_LABEL: Record<string, string> = {
  mining: "採掘",
  power: "動力",
  delivery: "配送",
  research: "研究",
};

export function BuildingCard({
  def,
  state,
  characters,
}: {
  def: BuildingDef;
  state: BuildingState;
  characters: Character[];
}) {
  const upgradeBuilding = useGameStore((s) => s.upgradeBuilding);
  const assignCharacter = useGameStore((s) => s.assignCharacter);
  const resources = useGameStore((s) => s.resources);

  if (!state.unlocked) {
    return (
      <div className="card" style={{ opacity: 0.55 }}>
        <div className="card__title">
          {def.icon} {def.name}
        </div>
        <div className="empty-state">研究タブで設計図を解放すると建設できる</div>
      </div>
    );
  }

  const cost = def.upgradeCost(state.level);
  const canAffordUpgrade = Object.entries(cost).every(
    ([k, v]) => resources[k as keyof typeof resources] >= (v ?? 0)
  );

  const assignable = characters.filter(
    (c) => c.temperState === "confirmed" && (!c.assignedBuildingId || c.id === state.assignedCharacterId)
  );
  const assignedCharacter = characters.find((c) => c.id === state.assignedCharacterId);

  return (
    <div className="card">
      <div className="card__title">
        {def.icon} {def.name}
        <span className="tag rarity-common">Lv.{state.level}</span>
      </div>
      <p className="card__desc">{def.description}</p>

      <div className="card__row">
        <span>適性</span>
        <span>{AFFINITY_LABEL[def.affinity]}</span>
      </div>

      <div className="progress">
        <div
          className="progress__fill"
          style={{ width: `${Math.min(1, state.progress) * 100}%` }}
        />
      </div>

      <div className="card__row">
        <span>配属</span>
        <select
          value={state.assignedCharacterId ?? ""}
          onChange={(e) =>
            assignCharacter(def.id, e.target.value === "" ? undefined : e.target.value)
          }
        >
          <option value="">（なし）</option>
          {assignable.map((c) => (
            <option key={c.id} value={c.id}>
              {c.icon} {c.name}
            </option>
          ))}
        </select>
      </div>
      {assignedCharacter && (
        <div className="card__row">
          <span>ボーナス</span>
          <span>
            +{Math.round((assignedCharacter.confirmed[def.affinity] / 100) * 50)}%
          </span>
        </div>
      )}

      <button
        className="btn"
        disabled={!canAffordUpgrade}
        onClick={() => upgradeBuilding(def.id)}
      >
        レベルアップ（{formatCost(cost)}）
      </button>
    </div>
  );
}
