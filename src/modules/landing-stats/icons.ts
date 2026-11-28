export const STAT_ICONS = [
  "school", "users", "map", "shield", "headset", "chart",
  "phone", "settings", "book", "award", "globe", "clock",
] as const;

export type StatIcon = (typeof STAT_ICONS)[number];
