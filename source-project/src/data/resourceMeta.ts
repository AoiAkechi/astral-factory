import type { ResourceKey } from "../types";

export const RESOURCE_META: Record<ResourceKey, { icon: string; label: string }> = {
  wood: { icon: "🪵", label: "木材" },
  wheat: { icon: "🌾", label: "小麦" },
  flour: { icon: "🌫️", label: "小麦粉" },
  bread: { icon: "🍞", label: "パン" },
  ore: { icon: "⛏️", label: "鉱石" },
  crystal: { icon: "🔮", label: "妖精結晶" },
  gald: { icon: "🪙", label: "ゴールド" },
  happiness: { icon: "💗", label: "幸福度" },
};

export function formatAmount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 10_000) return `${(n / 1000).toFixed(1)}k`;
  return Number.isInteger(n) ? `${n}` : n.toFixed(1);
}

export function formatCost(cost: Partial<Record<ResourceKey, number>>): string {
  return Object.entries(cost)
    .map(([k, v]) => `${RESOURCE_META[k as ResourceKey].icon}${formatAmount(v ?? 0)}`)
    .join(" ");
}
