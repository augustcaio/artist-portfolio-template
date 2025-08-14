import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin";

  console.log("Callback route called with:", { code: !!code, origin, next });

  if (code) {
    try {
      // Redirecionar diretamente para a dashboard com o código
      // O cliente browser-side irá processar a autenticação
      const redirectUrl = `${origin}${next}?auth_code=${code}`;
      console.log("Redirecting to:", redirectUrl);
      return NextResponse.redirect(redirectUrl);
    } catch (err) {
      console.error("Error in callback:", err);
    }
  }

  // Se houver erro ou não houver código, redirecionar para login
  console.log("Redirecting to login");
  return NextResponse.redirect(`${origin}/login`);
}
