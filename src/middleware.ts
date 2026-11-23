import { NextResponse, type NextRequest } from "next/server";
import { parseTarget, type RoutingMode } from "@/core/tenancy/host-parser";

export function middleware(req: NextRequest) {
  const headers = new Headers(req.headers);
  headers.delete("x-school-slug");

  const mode: RoutingMode =
    process.env.NEXT_PUBLIC_ROUTING_MODE === "SUBDOMAIN" ? "SUBDOMAIN" : "PATH";

  const target = parseTarget({
    mode,
    host: req.headers.get("host") ?? "",
    pathname: req.nextUrl.pathname,
    rootDomain: process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "",
  });

  if (target.kind === "pass") {
    return NextResponse.next({ request: { headers } });
  }

  headers.set("x-school-slug", target.slug);
  const url = req.nextUrl.clone();
  url.pathname = target.path;
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
