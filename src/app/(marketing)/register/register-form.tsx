"use client";

import { useState } from "react";

const STAGES: [string, string][] = [
  ["ECDE", "ECDE (PP1-PP2)"],
  ["LOWER_PRIMARY", "Lower Primary"],
  ["UPPER_PRIMARY", "Upper Primary"],
  ["JUNIOR_SCHOOL", "Junior School"],
  ["SENIOR_SCHOOL", "Senior School"],
  ["SECONDARY_844", "Secondary (8-4-4)"],
];

const field = { display: "block", width: "100%", padding: "10px 12px", marginTop: 4, fontSize: 15, border: "1px solid #cbd5e1", borderRadius: 6, boxSizing: "border-box" } as const;
const label = { display: "block", marginTop: 14, fontSize: 14, fontWeight: 600 } as const;

export default function RegisterForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ loginPath: string; email: string; trialDays: number } | null>(null);
  const [stages, setStages] = useState<string[]>([]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "");
    const payload = {
      schoolName: get("schoolName"),
      slug: get("slug"),
      county: get("county"),
      schoolEmail: get("schoolEmail"),
      phone: get("phone"),
      stages,
      firstName: get("firstName"),
      lastName: get("lastName"),
      adminEmail: get("adminEmail"),
      password: get("password"),
    };
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => null)) as { error?: string; loginPath?: string; trialDays?: number } | null;
      if (!res.ok || !json?.loginPath) {
        setError(json?.error ?? "Could not create the school, try again");
        setBusy(false);
        return;
      }
      setDone({ loginPath: json.loginPath, email: payload.adminEmail.trim().toLowerCase(), trialDays: json.trialDays ?? 30 });
    } catch {
      setError("Network problem, try again");
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div>
        <h2 style={{ color: "#15803d" }}>Your school is ready</h2>
        <p>Your {done.trialDays}-day free trial has started. Log in with <strong>{done.email}</strong> and the password you chose.</p>
        <a href={done.loginPath} style={{ display: "inline-block", padding: "12px 24px", background: "#1d4ed8", color: "#fff", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>
          Go to your school login
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit}>
      <label style={label}>School official name<input name="schoolName" required style={field} /></label>
      <label style={label}>Subdomain (letters, digits, hyphens)<input name="slug" required style={field} placeholder="alliancehigh" /></label>
      <label style={label}>County<input name="county" required style={field} /></label>
      <label style={label}>School email<input name="schoolEmail" type="email" required style={field} /></label>
      <label style={label}>School phone (optional)<input name="phone" style={field} /></label>
      <fieldset style={{ marginTop: 14, border: "1px solid #e2e8f0", borderRadius: 6 }}>
        <legend style={{ fontSize: 14, fontWeight: 600 }}>School levels</legend>
        {STAGES.map(([v, t]) => (
          <label key={v} style={{ display: "block", padding: "4px 0", fontSize: 15 }}>
            <input
              type="checkbox"
              checked={stages.includes(v)}
              onChange={(ev) => setStages((s) => (ev.target.checked ? [...s, v] : s.filter((x) => x !== v)))}
            />{" "}
            {t}
          </label>
        ))}
      </fieldset>
      <label style={label}>Principal first name<input name="firstName" required style={field} /></label>
      <label style={label}>Principal last name<input name="lastName" required style={field} /></label>
      <label style={label}>Principal email (your login)<input name="adminEmail" type="email" required style={field} /></label>
      <label style={label}>Password (at least 8 characters)<input name="password" type="password" required minLength={8} style={field} /></label>
      {error ? <p style={{ color: "#b91c1c", marginTop: 14 }}>{error}</p> : null}
      <button type="submit" disabled={busy} style={{ marginTop: 20, padding: "12px 24px", fontSize: 16, fontWeight: 600, color: "#fff", background: busy ? "#64748b" : "#1d4ed8", border: 0, borderRadius: 8, cursor: busy ? "default" : "pointer" }}>
        {busy ? "Creating your school..." : "Start free trial"}
      </button>
    </form>
  );
}
