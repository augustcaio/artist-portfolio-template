import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Temporariamente desabilitado para debug
  console.log("Middleware - Allowing all requests");
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/auth/callback"],
};
