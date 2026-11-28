import { z } from "zod";
import { STAT_ICONS } from "./icons";

const icon = z.enum(STAT_ICONS);
const value = z.string().trim().min(1).max(20);
const label = z.string().trim().min(1).max(40);

export const createStatSchema = z.object({ icon, value, label }).strict();

export const updateStatSchema = z
  .object({ icon: icon.optional(), value: value.optional(), label: label.optional() })
  .strict()
  .refine((o) => Object.keys(o).length > 0, { message: "Nothing to update" });

export const reorderSchema = z
  .object({ ids: z.array(z.string().min(1)).min(1).max(50) })
  .strict();
