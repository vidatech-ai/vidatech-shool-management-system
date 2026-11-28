import { useState, type FormEvent } from "react";
import s from "../schools/schools.module.css";
import st from "./stats.module.css";
import { STAT_ICONS, type StatIcon } from "@/modules/landing-stats/icons";
import type { StatInput } from "@/modules/landing-stats/types";
import IconPicker from "./icon-picker";

type Props = {
  initial?: { icon: string; value: string; label: string };
  submitLabel: string;
  busy: boolean;
  onSubmit: (v: StatInput) => Promise<boolean>;
  onCancel?: () => void;
};

const asIcon = (x?: string): StatIcon =>
  (STAT_ICONS as readonly string[]).includes(x ?? "") ? (x as StatIcon) : "school";

export default function StatForm({ initial, submitLabel, busy, onSubmit, onCancel }: Props) {
  const [icon, setIcon] = useState<StatIcon>(asIcon(initial?.icon));
  const [value, setValue] = useState(initial?.value ?? "");
  const [label, setLabel] = useState(initial?.label ?? "");
  const [problem, setProblem] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    const v = value.trim();
    const l = label.trim();
    if (!v || v.length > 20) {
      setProblem("Value must be 1 to 20 characters.");
      return;
    }
    if (!l || l.length > 40) {
      setProblem("Label must be 1 to 40 characters.");
      return;
    }
    setProblem("");
    const ok = await onSubmit({ icon, value: v, label: l });
    if (ok && !initial) {
      setValue("");
      setLabel("");
    }
  }

  return (
    <form className={st.form} onSubmit={submit}>
      <IconPicker value={icon} onChange={setIcon} />
      <div className={st.fields}>
        <label className={st.field}>
          Value
          <input className={st.input} value={value} maxLength={20} placeholder="e.g. 1,000+" onChange={(e) => setValue(e.target.value)} />
        </label>
        <label className={st.field}>
          Label
          <input className={st.input} value={label} maxLength={40} placeholder="e.g. Schools Trust Us" onChange={(e) => setLabel(e.target.value)} />
        </label>
      </div>
      {problem ? <p className={s.error} role="alert">{problem}</p> : null}
      <div className={st.formActions}>
        <button type="submit" className={s.btnOk} disabled={busy}>
          {busy ? "Working..." : submitLabel}
        </button>
        {onCancel ? (
          <button type="button" className={s.btnGhost} onClick={onCancel} disabled={busy}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
