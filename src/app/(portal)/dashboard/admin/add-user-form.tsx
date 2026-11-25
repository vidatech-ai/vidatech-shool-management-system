"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ROLES = ["TEACHER", "STUDENT", "PARENT", "SUPPORT_STAFF", "ACCOUNTANT"];
const field = { padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: 6, fontSize: 14 } as const;

export default function AddUserForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(fd.entries())),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setMsg({ ok: true, text: "User created." });
        form.reset();
        router.refresh();
      } else {
        setMsg({ ok: false, text: data.error || `Request failed (${res.status})` });
      }
    } catch {
      setMsg({ ok: false, text: "Network error, try again" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", alignItems: "end" }}>
      <select name="role" required defaultValue="TEACHER" style={field}>
        {ROLES.map((r) => (
          <option key={r} value={r}>{r.replace("_", " ")}</option>
        ))}
      </select>
      <input name="firstName" placeholder="First name" required style={field} />
      <input name="lastName" placeholder="Last name" required style={field} />
      <input name="email" type="email" placeholder="Email" style={field} />
      <input name="phone" placeholder="Phone" style={field} />
      <input name="admissionNumber" placeholder="Admission number" style={field} />
      <input name="password" type="password" placeholder="Temporary password (8+ chars)" required minLength={8} style={field} />
      <button type="submit" disabled={busy} style={{ ...field, background: "#1d4ed8", color: "#fff", border: "none", cursor: busy ? "wait" : "pointer", fontWeight: 600 }}>
        {busy ? "Creating..." : "Add user"}
      </button>
      {msg ? (
        <p role="status" style={{ gridColumn: "1 / -1", margin: 0, color: msg.ok ? "#15803d" : "#b91c1c", fontSize: 14 }}>
          {msg.text}
        </p>
      ) : null}
    </form>
  );
}
