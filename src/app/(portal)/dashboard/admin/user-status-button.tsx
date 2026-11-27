"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserStatusButton({ userId, isActive }: { userId: string; isActive: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onClick() {
    if (isActive && !window.confirm("Deactivate this user? They will not be able to log in.")) return;
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        router.refresh();
      } else {
        setErr(data.error || `Request failed (${res.status})`);
      }
    } catch {
      setErr("Network error, try again");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        disabled={busy}
        style={{
          padding: "4px 10px",
          fontSize: 13,
          borderRadius: 6,
          border: "1px solid #cbd5e1",
          background: "#fff",
          color: isActive ? "#b91c1c" : "#15803d",
          cursor: busy ? "wait" : "pointer",
        }}
      >
        {busy ? "Working..." : isActive ? "Deactivate" : "Reactivate"}
      </button>
      {err ? <div style={{ color: "#b91c1c", fontSize: 12, marginTop: 4 }}>{err}</div> : null}
    </div>
  );
}
