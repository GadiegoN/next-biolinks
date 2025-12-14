// src/app/auth/auth-code-error/page.tsx
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;
  const errorMessage = params.error || "Ocorreu um erro na autenticação.";

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-zinc-50 p-4 text-center">
      <div className="p-4 bg-red-100 rounded-full text-red-600">
        <AlertTriangle size={32} />
      </div>
      <h1 className="text-2xl font-bold text-zinc-900">
        Link Inválido ou Expirado
      </h1>
      <p className="text-zinc-600 max-w-md">{errorMessage}</p>
      <div className="mt-4">
        <Link href="/login">
          <Button>Tentar Login Novamente</Button>
        </Link>
      </div>
    </div>
  );
}
