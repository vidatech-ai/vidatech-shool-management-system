import type { StatIcon } from "./icons";

export type StatDTO = { id: string; icon: string; value: string; label: string };
export type StatInput = { icon: StatIcon; value: string; label: string };
