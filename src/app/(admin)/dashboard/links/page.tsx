import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AddLinkForm } from "@/components/forms/add-link-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LinkItem } from "../_components/link-item";

export default async function LinksPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const userPage = await prisma.page.findUnique({
    where: { userId: user.id },
    include: {
      links: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!userPage) redirect("/dashboard");

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Editar Links</h1>
          <p className="text-muted-foreground">
            Gerencie o cardápio ou botões do site /{userPage.slug}
          </p>
        </div>
        <div className="ml-auto">
          <Link href={`/${userPage.slug}`} target="_blank">
            <Button variant="secondary">Ver Página Pública</Button>
          </Link>
        </div>
      </div>

      <AddLinkForm />

      <div className="space-y-2">
        <h3 className="font-semibold text-lg mb-4">Seus Itens Ativos</h3>

        {userPage.links.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-xl text-muted-foreground">
            Você ainda não adicionou nenhum link ou produto.
          </div>
        ) : (
          userPage.links.map((link) => (
            <LinkItem
              key={link.id}
              link={{
                ...link,
                price: link.price ? Number(link.price) : null,
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
