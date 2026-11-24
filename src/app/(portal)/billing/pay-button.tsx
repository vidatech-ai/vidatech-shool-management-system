"use client";

import { useState } from "react";

export default function PayButton({ label }: { label: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/paystack/initialize", { method: "POST" });
      const json = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;
      if (!res.ok || !json?.url) {
        setError(json?.error ?? "Could not start payment, try again");
        setBusy(false);
        return;
      }
      window.location.href = json.url;
    } catch {
      setError("Network problem, try again");
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        onClick={pay}
        disabled={busy}
        style={{
          padding: "12px 24px",
          fontSize: 16,
          fontWeight: 600,
          color: "#fff",
          background: busy ? "#64748b" : "#1d4ed8",
          border: 0,
          borderRadius: 8,
          cursor: busy ? "default" : "pointer",
        }}
      >
        {busy ? "Opening Paystack..." : label}
      </button>
      {error ? <p style={{ color: "#b91c1c", marginTop: 12 }}>{error}</p> : null}
    </div>
  );
}
