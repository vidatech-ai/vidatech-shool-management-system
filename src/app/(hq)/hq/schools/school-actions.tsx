"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import s from "./schools.module.css";

type Props = {
  id: string;
  name: string;
  status: "PENDING_PAYMENT" | "ACTIVE" | "SUSPENDED";
  isTrial: boolean;
  phone: string | null;
};

export default function SchoolActions({ id, name, status, isTrial, phone }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (status === "PENDING_PAYMENT" && !isTrial) {
    return <span className={s.muted}>Awaiting payment</span>;
  }

  const approving = status === "PENDING_PAYMENT";
  const suspending = status === "ACTIVE";

  function close() {
    if (busy) return;
    setOpen(false);
    setReason("");
    setError("");
  }

  async function submit() {
    setError("");
    if (suspending && reason.trim().length < 5) {
      setError("Enter a reason of at least 5 characters.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/hq/schools/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: approving ? "APPROVE" : suspending ? "SUSPEND" : "REACTIVATE",
          reason: reason.trim(),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Request failed");
        setBusy(false);
        return;
      }
      setBusy(false);
      setOpen(false);
      setReason("");
      router.refresh();
    } catch {
      setError("Network error. Check your connection and try again.");
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className={suspending ? s.btnDanger : s.btnOk}
        onClick={() => setOpen(true)}
      >
        {approving ? "Approve" : suspending ? "Suspend" : "Reactivate"}
      </button>

      {open ? (
        <div className={s.overlay} role="dialog" aria-modal="true" onClick={close}>
          <div className={s.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={s.modalTitle}>
              {approving ? "Approve" : suspending ? "Suspend" : "Reactivate"} {name}?
            </h2>
            <p className={s.modalText}>
              {suspending
                ? "The school and all its users lose access on their next page load. The reason is saved and written to the audit log."
                : approving
                  ? `Call ${phone ?? "the school"} first. Approving sets the school ACTIVE and starts the free trial from now.`
                  : "The school returns to ACTIVE. This does not extend an expired subscription."}
            </p>
            {suspending ? (
              <textarea
                className={s.textarea}
                rows={3}
                maxLength={500}
                placeholder="Reason (required, at least 5 characters)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            ) : null}
            {error ? (
              <p className={s.error} role="alert">
                {error}
              </p>
            ) : null}
            <div className={s.modalActions}>
              <button type="button" className={s.btnGhost} onClick={close} disabled={busy}>
                Cancel
              </button>
              <button
                type="button"
                className={suspending ? s.btnDanger : s.btnOk}
                onClick={submit}
                disabled={busy}
              >
                {busy ? "Working..." : approving ? "Confirm approve" : suspending ? "Confirm suspend" : "Confirm reactivate"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
