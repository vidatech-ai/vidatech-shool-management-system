"use client";

import { useEffect, useState, type FormEvent } from "react";
import styles from "./login.module.css";

const KEY = "vt_hq_login";

export default function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setIdentifier(saved);
    } catch {}
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/hq/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Sign in failed");
        setBusy(false);
        return;
      }
      try {
        if (remember) localStorage.setItem(KEY, identifier.trim());
        else localStorage.removeItem(KEY);
      } catch {}
      window.location.assign("/hq");
    } catch {
      setError("Network error. Check your connection and try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className={styles.form} noValidate>
      <label htmlFor="identifier" className={styles.label}>
        Email
      </label>
      <input
        id="identifier"
        className={styles.input}
        type="email"
        autoComplete="username"
        placeholder="owner@vidatech.com"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        required
      />

      <label htmlFor="password" className={styles.label}>
        Password
      </label>
      <div className={styles.passWrap}>
        <input
          id="password"
          className={styles.input}
          type={show ? "text" : "password"}
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="button"
          className={styles.eye}
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C5 20 1 12 1 12a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.1 9.1 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24" />
              <path d="M1 1l22 22" />
            </svg>
          )}
        </button>
      </div>

      <div className={styles.row}>
        <label className={styles.check}>
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          <span>Remember me</span>
        </label>
      </div>

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" className={styles.submit} disabled={busy}>
        {busy ? <span className={styles.spinner} aria-hidden="true" /> : null}
        {busy ? "Signing in..." : "Sign in to HQ"}
      </button>
    </form>
  );
}
