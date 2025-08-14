import { createClientServer } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin";

  console.log("Callback route called with:", { code: !!code, origin, next });

  if (code) {
    try {
      const supabase = createClientServer();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      console.log("Exchange result:", { error: error?.message });

      if (!error) {
        // Login bem-sucedido, redirecionar para a dashboard
        console.log("Redirecting to:", `${origin}${next}`);
        return NextResponse.redirect(`${origin}${next}`);
      }
    } catch (err) {
      console.error("Error in callback:", err);
    }
  }

  // Se houver erro ou não houver código, redirecionar para login
  console.log("Redirecting to login");
  return NextResponse.redirect(`${origin}/login`);
}
