"use client";

import { useState, type FormEvent } from "react";
import styles from "./login.module.css";

export default function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState(false);

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
        placeholder="username@gmail.com"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        required
      />

      <label htmlFor="password" className={`${styles.label} ${styles.labelGap}`}>
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C5 20 1 12 1 12a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.1 9.1 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24" />
              <path d="M1 1l22 22" />
            </svg>
          )}
        </button>
      </div>

      <button type="button" className={styles.forgot} onClick={() => setHint((h) => !h)}>
        Forgot Password?
      </button>
      {hint ? (
        <p className={styles.hint}>
          The HQ password is reset by the platform owner in the server settings.
        </p>
      ) : null}

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" className={styles.submit} disabled={busy}>
        {busy ? <span className={styles.spinner} aria-hidden="true" /> : null}
        {busy ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
