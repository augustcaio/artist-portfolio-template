import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body as {
      name?: string;
      email?: string;
      message?: string;
    };

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Campos obrigatórios: name, email, message" },
        { status: 400 }
      );
    }

    const toAddress = process.env.CONTACT_TO_EMAIL || "santosssag@gmail.com";

    // Use o remetente de onboarding do Resend para testes (não requer domínio verificado)
    // Depois que você verificar um domínio no Resend, troque para algo como
    // `from: "Portfólio <contato@seu-dominio.com>"`
    const { error } = await resend.emails.send({
      from: "Portfólio <onboarding@resend.dev>",
      to: [toAddress],
      replyTo: email,
      subject: `Novo contato pelo site – ${name}`,
      text: `Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Falha ao enviar email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Erro inesperado", details: String(err) },
      { status: 500 }
    );
  }
}
