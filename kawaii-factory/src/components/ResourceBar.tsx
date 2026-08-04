import { useGameStore } from "../state/store";
import { RESOURCE_META, formatAmount } from "../data/resourceMeta";
import type { ResourceKey } from "../types";

const DISPLAY_ORDER: ResourceKey[] = [
  "wood",
  "wheat",
  "flour",
  "bread",
  "ore",
  "crystal",
  "gald",
  "happiness",
];

export function ResourceBar() {
  const resources = useGameStore((s) => s.resources);

  return (
    <div className="resource-bar">
      <span className="resource-bar__title">🏭 Kawaii Factory</span>
      {DISPLAY_ORDER.map((key) => {
        const meta = RESOURCE_META[key];
        return (
          <span className="resource-chip" key={key} title={meta.label}>
            <span className="resource-chip__icon">{meta.icon}</span>
            <span className="resource-chip__value">
              {formatAmount(resources[key])}
            </span>
            <span className="resource-chip__label">{meta.label}</span>
          </span>
        );
      })}
    </div>
  );
}
