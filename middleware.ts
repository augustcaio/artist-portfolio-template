import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = new URL(req.url);

  // Permitir acesso à rota de callback
  if (url.pathname.startsWith("/auth/callback")) {
    return NextResponse.next();
  }

  if (url.pathname.startsWith("/admin")) {
    // Verificar se há cookies de sessão do Supabase
    const hasSupabaseCookie = req.cookies
      .getAll()
      .some((c) => c.name.startsWith("sb"));

    // Verificar especificamente o cookie de sessão
    const sessionCookie = req.cookies.get("sb-access-token");

    if (!hasSupabaseCookie || !sessionCookie) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/auth/callback"],
};
