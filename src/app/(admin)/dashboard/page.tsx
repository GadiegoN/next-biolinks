import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CreatePageForm } from "@/components/forms/create-page-form";
import {
  BarChart3,
  ExternalLink,
  Settings,
  Share2,
  Plus,
  LayoutDashboard,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { UpgradeButton } from "@/components/client/upgrade-button";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user: supabaseUser },
    error,
  } = await supabase.auth.getUser();
  if (error || !supabaseUser) redirect("/login");

  let dbUser = await prisma.user.findUnique({
    where: { email: supabaseUser.email! },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: supabaseUser.id,
        email: supabaseUser.email!,
        name: supabaseUser.user_metadata.full_name || "Empreendedor",
      },
    });
  }

  const userPage = await prisma.page.findUnique({
    where: { userId: dbUser.id },
    include: { links: true },
  });

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950">
      <header className="border-b bg-white dark:bg-zinc-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg">
          <LayoutDashboard className="w-5 h-5 text-emerald-600" />
          <span>Painel de Controle</span>
        </div>
        <div className="text-sm text-muted-foreground">{dbUser.email}</div>
      </header>

      <main className="p-6 max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Olá, {dbUser.name?.split(" ")[0] || "Visitante"} 👋
          </h1>
          <p className="text-muted-foreground">
            Aqui está o resumo do seu negócio digital hoje.
          </p>
        </div>

        {!userPage ? (
          <Card className="border-dashed border-2 border-emerald-200 bg-emerald-50/50 dark:bg-emerald-900/10 dark:border-emerald-900">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="p-4 bg-white dark:bg-zinc-800 rounded-full shadow-sm">
                <Plus className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold">
                  Você ainda não tem um site
                </h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Crie sua página agora para começar a receber pedidos no
                  WhatsApp e organizar seus links.
                </p>
              </div>
              <div className="pt-4">
                <CreatePageForm />
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Visualizações Totais
                  </CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {userPage.totalViews}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Acessos na sua página
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Links Ativos
                  </CardTitle>
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {userPage.links.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Botões no seu site
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Plano Atual
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-emerald-600">
                      {dbUser.planStatus === "FREE"
                        ? "Gratuito"
                        : "Pro / Vitalício"}
                    </div>
                    {dbUser.planStatus !== "FREE" && (
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-bold">
                        ATIVO
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {dbUser.planStatus === "FREE"
                      ? "Upgrade para remover limites"
                      : "Você tem acesso total a todas as ferramentas."}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4 border-emerald-100 dark:border-emerald-900">
                <CardHeader>
                  <CardTitle>Sua Página Online</CardTitle>
                  <CardDescription>
                    Este é o link que você deve colocar na Bio do Instagram.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg font-mono text-sm flex items-center justify-between">
                    <span className="truncate">
                      next-biolinks.vercel.app/{userPage.slug}
                    </span>
                    <Link href={`/${userPage.slug}`} target="_blank">
                      <ExternalLink className="w-4 h-4 text-zinc-500 hover:text-emerald-600 cursor-pointer" />
                    </Link>
                  </div>
                  <div className="flex gap-3">
                    <Link href="/dashboard/links" className="w-full">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                        Gerenciar Links e Produtos
                      </Button>
                    </Link>
                    <Link href={`/${userPage.slug}`} target="_blank">
                      <Button variant="outline">Ver Site</Button>
                    </Link>
                  </div>

                  {dbUser.planStatus === "FREE" && <UpgradeButton />}
                </CardContent>
              </Card>

              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Customização</CardTitle>
                  <CardDescription>
                    Deixe o site com a cara da sua marca.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/dashboard/settings">
                    <Button
                      variant="secondary"
                      className="w-full justify-start h-12"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Editar Foto e Textos
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-12 text-muted-foreground"
                    disabled
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Integrações (Em breve)
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
