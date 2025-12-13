import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { CreatePageForm } from "@/components/forms/create-page-form";
import Link from "next/link";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user: supabaseUser },
    error,
  } = await supabase.auth.getUser();

  if (error || !supabaseUser) {
    redirect("/login");
  }

  let dbUser = await prisma.user.findUnique({
    where: { email: supabaseUser.email! },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: supabaseUser.id,
        email: supabaseUser.email!,
        name: supabaseUser.user_metadata.full_name || "Usuário",
      },
    });
  }

  const userPage = await prisma.page.findUnique({
    where: { userId: dbUser.id },
    include: { links: true },
  });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Painel de Controle</h1>
      <p className="mb-8 text-muted-foreground">Logado como: {dbUser.email}</p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-6 border rounded-xl bg-card">
          <h3 className="font-semibold mb-2">Plano Atual</h3>
          <p className="text-2xl font-bold text-emerald-600">
            {dbUser.planStatus === "FREE" ? "Gratuito" : "Premium"}
          </p>
        </div>

        <div className="p-6 border rounded-xl bg-card">
          <h3 className="font-semibold mb-2">Sua Página</h3>
          {userPage ? (
            <div>
              <p className="text-muted-foreground mb-4 flex items-center gap-2">
                <span className="bg-muted px-2 py-1 rounded font-mono">
                  /{userPage.slug}
                </span>
              </p>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href="/dashboard/links">Visualizar</Link>
                </Button>
                <Button>Editar Links</Button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-muted-foreground mb-4">
                Você ainda não tem página. Crie agora para começar a receber
                pedidos.
              </p>
              <CreatePageForm />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
