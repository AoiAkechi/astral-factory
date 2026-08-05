import { useGameStore } from "../state/store";

const MILESTONES = [10, 30, 60, 120, 250, 500];

export function VillageView() {
  const happiness = useGameStore((s) => s.resources.happiness);
  const logs = useGameStore((s) => s.logs);

  const nextMilestone = MILESTONES.find((m) => m > happiness) ?? MILESTONES[MILESTONES.length - 1];
  const prevMilestone = MILESTONES[MILESTONES.indexOf(nextMilestone) - 1] ?? 0;
  const ratio = Math.min(
    1,
    (happiness - prevMilestone) / (nextMilestone - prevMilestone)
  );

  return (
    <div>
      <div className="panel">
        <div className="panel__header">
          <div>
            <div className="panel__eyebrow">Village Overview</div>
            <h2>開拓村</h2>
          </div>
        </div>
        <p className="card__desc">
          妖怪や獣人が暮らすこの村で、畑から始まる生産ラインを育てていく。
          幸福度が上がるほど、新しい仲間や技術が村にやってくる。
        </p>

        <div className="card__row">
          <span>💗 幸福度</span>
          <span>
            {happiness.toFixed(0)} / {nextMilestone}
          </span>
        </div>
        <div className="progress">
          <div
            className="progress__fill plum"
            style={{ width: `${ratio * 100}%` }}
          />
        </div>
      </div>

      <div className="panel">
        <div className="panel__header">
          <h2>できごと</h2>
          <span className="panel__eyebrow">最新30件</span>
        </div>
        {logs.length === 0 ? (
          <div className="empty-state">
            まだ何も起きていない。「ダンジョン」タブから探索してみよう。
          </div>
        ) : (
          <div className="log-panel">
            {logs.map((l) => (
              <div key={l.id}>・{l.message}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
