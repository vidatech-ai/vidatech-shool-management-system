import { ArrowDown, ArrowUp } from "lucide-react";
import s from "../schools/schools.module.css";
import st from "./stats.module.css";
import type { StatDTO } from "@/modules/landing-stats/types";
import { StatIconView } from "@/modules/landing-stats/icon-map";

type Props = {
  stat: StatDTO;
  first: boolean;
  last: boolean;
  busy: boolean;
  onMove: (d: -1 | 1) => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function StatRow({ stat, first, last, busy, onMove, onEdit, onDelete }: Props) {
  return (
    <li className={st.row}>
      <span className={st.rowIcon}>
        <StatIconView name={stat.icon} />
      </span>
      <div className={st.rowText}>
        <div className={st.rowValue}>{stat.value}</div>
        <div className={st.rowLabel}>{stat.label}</div>
      </div>
      <div className={st.rowActions}>
        <button type="button" className={`${s.btnGhost} ${st.arrow}`} aria-label="Move up" disabled={busy || first} onClick={() => onMove(-1)}>
          <ArrowUp size={16} />
        </button>
        <button type="button" className={`${s.btnGhost} ${st.arrow}`} aria-label="Move down" disabled={busy || last} onClick={() => onMove(1)}>
          <ArrowDown size={16} />
        </button>
        <button type="button" className={s.btnGhost} disabled={busy} onClick={onEdit}>Edit</button>
        <button type="button" className={s.btnDanger} disabled={busy} onClick={onDelete}>Delete</button>
      </div>
    </li>
  );
}
