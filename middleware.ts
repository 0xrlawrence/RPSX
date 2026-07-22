import { NextResponse, type NextRequest } from "next/server";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "";

/**
 * Wildcard-subdomain tenancy: {slug}.rpsx.app is rewritten to /t/{slug}
 * so every business gets its own branded portal address. Path routing
 * (/t/{slug}) keeps working everywhere, including *.vercel.app previews.
 */
export function middleware(req: NextRequest) {
  if (!ROOT_DOMAIN) return NextResponse.next();

  const host = (req.headers.get("host") ?? "").split(":")[0].toLowerCase();
  if (host === ROOT_DOMAIN || host === `www.${ROOT_DOMAIN}`) {
    return NextResponse.next();
  }
  if (!host.endsWith(`.${ROOT_DOMAIN}`)) return NextResponse.next();

  const slug = host.slice(0, -(ROOT_DOMAIN.length + 1));
  if (!slug || slug.includes(".")) return NextResponse.next();

  const url = req.nextUrl.clone();
  if (url.pathname.startsWith("/t/")) return NextResponse.next();
  url.pathname = `/t/${slug}${url.pathname === "/" ? "" : url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/|api/|favicon.ico|.*\\..*).*)"],
};
