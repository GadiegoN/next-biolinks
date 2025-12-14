import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const error = searchParams.get("error");
  const error_description = searchParams.get("error_description");

  if (error) {
    console.error("Erro no callback:", error, error_description);
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?error=${error_description}`
    );
  }

  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(
      code
    );

    if (!sessionError) {
      return NextResponse.redirect(`${origin}${next}`);
    } else {
      console.error("Erro na sessão:", sessionError);
      return NextResponse.redirect(
        `${origin}/auth/auth-code-error?error=${sessionError.message}`
      );
    }
  }

  return NextResponse.redirect(
    `${origin}/auth/auth-code-error?error=Link inválido ou desconhecido`
  );
}
