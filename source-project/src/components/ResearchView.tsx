import { RESEARCH_TREE, RESEARCH_MAP } from "../data/research";
import { useGameStore } from "../state/store";
import { formatCost } from "../data/resourceMeta";

export function ResearchView() {
  const research = useGameStore((s) => s.research);
  const resources = useGameStore((s) => s.resources);
  const unlockResearch = useGameStore((s) => s.unlockResearch);

  return (
    <div className="panel">
      <div className="panel__header">
        <div>
          <div className="panel__eyebrow">Research Tree · MVP 8 nodes</div>
          <h2>研究</h2>
        </div>
      </div>
      <p className="card__desc">
        現在は基礎8ノードのみ。将来的には材料科学・生体/ダンジョン学・物流工学・
        開拓工学の4分野に分岐し、数千ノード規模まで拡張する構想。
      </p>
      <div className="belt-divider" style={{ margin: "12px 0" }} />
      <div className="grid grid--cards">
        {RESEARCH_TREE.map((node) => {
          const unlocked = !!research[node.id];
          const requiresOk = node.requires.every((r) => research[r]);
          const canAfford = Object.entries(node.cost).every(
            ([k, v]) => resources[k as keyof typeof resources] >= (v ?? 0)
          );

          return (
            <div className="card" key={node.id} style={{ opacity: unlocked ? 0.7 : 1 }}>
              <div className="card__title">📜 {node.name}</div>
              <p className="card__desc">{node.description}</p>
              <div className="card__row">
                <span>効果</span>
                <span>{node.effect}</span>
              </div>
              {node.requires.length > 0 && (
                <div className="card__row">
                  <span>前提</span>
                  <span>
                    {node.requires
                      .map((r) => RESEARCH_MAP[r]?.name ?? r)
                      .join(" / ")}
                  </span>
                </div>
              )}
              {unlocked ? (
                <span className="tag rarity-rare">解放済み</span>
              ) : (
                <button
                  className="btn"
                  disabled={!requiresOk || !canAfford}
                  onClick={() => unlockResearch(node.id)}
                >
                  解放（{formatCost(node.cost)}）
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
