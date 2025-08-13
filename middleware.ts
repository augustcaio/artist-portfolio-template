import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  if (url.pathname.startsWith("/admin")) {
    // Checagem simples: se não existir nenhum cookie do Supabase, redireciona
    const hasSupabaseCookie = req.cookies
      .getAll()
      .some((c) => c.name.startsWith("sb"));
    if (!hasSupabaseCookie) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
