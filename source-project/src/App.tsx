import { useEffect, useState } from "react";
import { ResourceBar } from "./components/ResourceBar";
import { TabNav, type TabId } from "./components/TabNav";
import { VillageView } from "./components/VillageView";
import { DungeonView } from "./components/DungeonView";
import { FactoryView } from "./components/FactoryView";
import { CharacterView } from "./components/CharacterView";
import { ResearchView } from "./components/ResearchView";
import { useGameStore } from "./state/store";

const TICK_MS = 1000;

export default function App() {
  const [tab, setTab] = useState<TabId>("village");
  const tick = useGameStore((s) => s.tick);
  const resetSave = useGameStore((s) => s.resetSave);

  useEffect(() => {
    const interval = setInterval(() => {
      tick(TICK_MS / 1000);
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [tick]);

  return (
    <>
      <ResourceBar />
      <div className="belt-divider" />
      <TabNav active={tab} onChange={setTab} />
      <main className="app-main">
        {tab === "village" && <VillageView />}
        {tab === "dungeon" && <DungeonView />}
        {tab === "factory" && <FactoryView />}
        {tab === "characters" && <CharacterView />}
        {tab === "research" && <ResearchView />}
      </main>
      <footer className="app-footer">
        Kawaii Factory MVP ·{" "}
        <button
          className="btn ghost"
          style={{ fontSize: "0.75rem", padding: "4px 10px" }}
          onClick={() => {
            if (confirm("セーブデータを削除して最初からやり直しますか？")) {
              resetSave();
            }
          }}
        >
          セーブをリセット
        </button>
      </footer>
    </>
  );
}
