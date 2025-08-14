import { createClientBrowser } from "@/lib/supabase-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin";

  if (code) {
    const supabase = createClientBrowser();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Login bem-sucedido, redirecionar para a dashboard
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Se houver erro ou não houver código, redirecionar para login
  return NextResponse.redirect(`${origin}/login`);
}
