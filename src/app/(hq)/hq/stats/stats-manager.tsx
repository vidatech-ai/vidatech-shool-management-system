"use client";

import { useState } from "react";
import s from "../schools/schools.module.css";
import st from "./stats.module.css";
import type { StatDTO, StatInput } from "@/modules/landing-stats/types";
import { statsApi } from "./stats-api";
import StatForm from "./stat-form";
import StatRow from "./stat-row";
import DeleteModal from "./delete-modal";

export default function StatsManager({ initial }: { initial: StatDTO[] }) {
  const [stats, setStats] = useState(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<StatDTO | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run(fn: () => Promise<string | null>): Promise<boolean> {
    setBusy(true);
    setError("");
    const err = await fn();
    if (err) setError(err);
    setBusy(false);
    return !err;
  }

  const add = (input: StatInput) =>
    run(async () => {
      const r = await statsApi.create(input);
      if (!r.ok) return r.error;
      setStats((p) => [...p, r.data.stat]);
      return null;
    });

  const save = (id: string, input: StatInput) =>
    run(async () => {
      const r = await statsApi.update(id, input);
      if (!r.ok) return r.error;
      setStats((p) => p.map((x) => (x.id === id ? r.data.stat : x)));
      setEditingId(null);
      return null;
    });

  const move = (i: number, d: -1 | 1) =>
    run(async () => {
      const j = i + d;
      if (j < 0 || j >= stats.length) return null;
      const next = [...stats];
      [next[i], next[j]] = [next[j], next[i]];
      const r = await statsApi.reorder(next.map((x) => x.id));
      if (!r.ok) return r.error;
      setStats(next);
      return null;
    });

  const confirmDelete = () =>
    run(async () => {
      if (!deleting) return null;
      const r = await statsApi.remove(deleting.id);
      if (!r.ok) return r.error;
      setStats((p) => p.filter((x) => x.id !== deleting.id));
      setDeleting(null);
      return null;
    });

  return (
    <>
      <section className={st.panel}>
        <h2 className={st.panelTitle}>Add a stat</h2>
        <StatForm submitLabel="Add stat" busy={busy} onSubmit={add} />
      </section>

      {error && !deleting ? <p className={s.error} role="alert">{error}</p> : null}

      {stats.length === 0 ? (
        <p className={st.empty}>No stats yet. Add your first one above.</p>
      ) : (
        <ul className={st.list}>
          {stats.map((x, i) =>
            editingId === x.id ? (
              <li key={x.id} className={st.panel}>
                <StatForm
                  initial={x}
                  submitLabel="Save"
                  busy={busy}
                  onSubmit={(v) => save(x.id, v)}
                  onCancel={() => setEditingId(null)}
                />
              </li>
            ) : (
              <StatRow
                key={x.id}
                stat={x}
                first={i === 0}
                last={i === stats.length - 1}
                busy={busy}
                onMove={(d) => move(i, d)}
                onEdit={() => setEditingId(x.id)}
                onDelete={() => {
                  setError("");
                  setDeleting(x);
                }}
              />
            ),
          )}
        </ul>
      )}

      {deleting ? (
        <DeleteModal
          stat={deleting}
          busy={busy}
          error={error}
          onCancel={() => {
            if (busy) return;
            setDeleting(null);
            setError("");
          }}
          onConfirm={confirmDelete}
        />
      ) : null}
    </>
  );
}
