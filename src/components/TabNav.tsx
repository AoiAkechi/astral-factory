export type TabId = "village" | "dungeon" | "factory" | "characters" | "research";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "village", label: "村", icon: "🏡" },
  { id: "dungeon", label: "ダンジョン", icon: "🌲" },
  { id: "factory", label: "工場", icon: "⚙️" },
  { id: "characters", label: "仲間", icon: "🦊" },
  { id: "research", label: "研究", icon: "📜" },
];

export function TabNav({
  active,
  onChange,
}: {
  active: TabId;
  onChange: (tab: TabId) => void;
}) {
  return (
    <nav className="tab-nav">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`tab-nav__btn ${active === tab.id ? "active" : ""}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.icon} {tab.label}
        </button>
      ))}
    </nav>
  );
}
