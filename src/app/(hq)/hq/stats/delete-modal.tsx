import s from "../schools/schools.module.css";
import type { StatDTO } from "@/modules/landing-stats/types";

type Props = {
  stat: StatDTO;
  busy: boolean;
  error: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteModal({ stat, busy, error, onCancel, onConfirm }: Props) {
  return (
    <div className={s.overlay} role="dialog" aria-modal="true" onClick={onCancel}>
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={s.modalTitle}>Delete this stat?</h2>
        <p className={s.modalText}>
          {stat.value} {stat.label} will be removed. This cannot be undone.
        </p>
        {error ? <p className={s.error} role="alert">{error}</p> : null}
        <div className={s.modalActions}>
          <button type="button" className={s.btnGhost} onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button type="button" className={s.btnDanger} onClick={onConfirm} disabled={busy}>
            {busy ? "Working..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
