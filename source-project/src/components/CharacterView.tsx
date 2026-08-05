import { useGameStore } from "../state/store";
import { GACHA_CRYSTAL_COST } from "../data/characters";
import { CharacterCard } from "./CharacterCard";

export function CharacterView() {
  const characters = useGameStore((s) => s.characters);
  const pullGacha = useGameStore((s) => s.pullGacha);
  const gachaUnlocked = useGameStore((s) => !!s.research["research_gacha"]);
  const crystal = useGameStore((s) => s.resources.crystal);

  return (
    <div>
      <div className="panel">
        <div className="panel__header">
          <div>
            <div className="panel__eyebrow">Recruitment</div>
            <h2>仲間の勧誘</h2>
          </div>
        </div>
        <p className="card__desc">
          妖精結晶を使って新しい仲間を勧誘する。引いた時点の潜在値が「種」になり、
          調練で確定ステータスに仕上がる。
        </p>
        <button
          className="btn plum"
          disabled={!gachaUnlocked || crystal < GACHA_CRYSTAL_COST}
          onClick={pullGacha}
        >
          {gachaUnlocked
            ? `勧誘する（🔮${GACHA_CRYSTAL_COST}）`
            : "研究タブで「妖精の勧誘」を解放"}
        </button>
      </div>

      <div className="panel">
        <div className="panel__header">
          <h2>仲間一覧</h2>
          <span className="panel__eyebrow">{characters.length}体</span>
        </div>
        {characters.length === 0 ? (
          <div className="empty-state">まだ仲間がいない。結晶を集めて勧誘しよう。</div>
        ) : (
          <div className="grid grid--cards">
            {characters.map((c) => (
              <CharacterCard key={c.id} character={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
