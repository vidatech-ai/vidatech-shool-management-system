import { STAT_ICONS, type StatIcon } from "@/modules/landing-stats/icons";
import { StatIconView } from "@/modules/landing-stats/icon-map";
import st from "./stats.module.css";

type Props = { value: StatIcon; onChange: (i: StatIcon) => void };

export default function IconPicker({ value, onChange }: Props) {
  return (
    <div className={st.picker} role="group" aria-label="Icon">
      {STAT_ICONS.map((name) => (
        <button
          key={name}
          type="button"
          title={name}
          aria-label={name}
          aria-pressed={value === name}
          className={`${st.iconBtn} ${value === name ? st.iconBtnOn : ""}`}
          onClick={() => onChange(name)}
        >
          <StatIconView name={name} />
        </button>
      ))}
    </div>
  );
}
