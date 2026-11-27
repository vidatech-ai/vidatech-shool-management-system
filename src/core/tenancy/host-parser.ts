export type RoutingMode = "PATH" | "SUBDOMAIN";

export type Target =
  | { kind: "pass" }
  | { kind: "school"; slug: string; path: string };

export const SLUG = /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/;
export const RESERVED = new Set(["www", "hq", "api", "app", "admin"]);

function toSchoolPath(rest: string): string {
  if (rest === "" || rest === "/") return "/site";
  if (rest === "/login" || rest === "/suspended") return `/site${rest}`;
  return rest;
}

export function parseTarget(opts: {
  mode: RoutingMode;
  host: string;
  pathname: string;
  rootDomain: string;
}): Target {
  if (opts.mode === "PATH") {
    const m = opts.pathname.match(/^\/s\/([^/]+)(\/.*)?$/);
    if (!m || !SLUG.test(m[1]) || RESERVED.has(m[1])) return { kind: "pass" };
    return { kind: "school", slug: m[1], path: toSchoolPath(m[2] ?? "/") };
  }

  const host = opts.host.split(":")[0].toLowerCase();
  const root = opts.rootDomain.split(":")[0].toLowerCase();
  if (!host.endsWith(`.${root}`)) return { kind: "pass" };

  const sub = host.slice(0, -(root.length + 1));
  if (sub.includes(".") || RESERVED.has(sub) || !SLUG.test(sub)) {
    return { kind: "pass" };
  }
  return { kind: "school", slug: sub, path: toSchoolPath(opts.pathname) };
}
