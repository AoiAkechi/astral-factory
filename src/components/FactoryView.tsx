import { BUILDINGS } from "../data/buildings";
import { useGameStore } from "../state/store";
import { BuildingCard } from "./BuildingCard";

export function FactoryView() {
  const buildings = useGameStore((s) => s.buildings);
  const characters = useGameStore((s) => s.characters);

  return (
    <div className="panel">
      <div className="panel__header">
        <div>
          <div className="panel__eyebrow">Production Chain</div>
          <h2>生産ライン</h2>
        </div>
      </div>
      <p className="card__desc">
        畑 → 水車 → パン工房 → 配送、の一直線のチェーン。仲間を配属すると、
        調練済みの適性ステータスに応じて生産量が伸びる。
      </p>
      <div className="belt-divider" style={{ margin: "12px 0" }} />
      <div className="grid grid--cards">
        {BUILDINGS.map((def) => (
          <BuildingCard
            key={def.id}
            def={def}
            state={buildings[def.id]}
            characters={characters}
          />
        ))}
      </div>
    </div>
  );
}
