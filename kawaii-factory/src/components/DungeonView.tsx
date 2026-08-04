import { useGameStore } from "../state/store";
import { DUNGEON_NAME, EXPLORE_COOLDOWN_SECONDS } from "../data/dungeon";

export function DungeonView() {
  const cooldown = useGameStore((s) => s.exploreCooldown);
  const explore = useGameStore((s) => s.explore);
  const researchEff = useGameStore((s) => !!s.research["research_dungeon_eff"]);

  const ratio = 1 - cooldown / EXPLORE_COOLDOWN_SECONDS;

  return (
    <div className="panel">
      <div className="panel__header">
        <div>
          <div className="panel__eyebrow">Exploration</div>
          <h2>{DUNGEON_NAME}</h2>
        </div>
        {researchEff && <span className="tag rarity-rare">探索装備 改良済</span>}
      </div>
      <p className="card__desc">
        村の外れに広がる森。木材・鉱石・小麦、そして稀に仲間ガチャの種となる
        「妖精結晶」が見つかる。
      </p>

      <div className="progress" style={{ marginBottom: 12 }}>
        <div
          className="progress__fill brass"
          style={{ width: `${Math.min(1, ratio) * 100}%` }}
        />
      </div>

      <button className="btn moss" disabled={cooldown > 0} onClick={explore}>
        {cooldown > 0 ? `探索中… ${cooldown.toFixed(1)}s` : "探索する"}
      </button>
    </div>
  );
}
