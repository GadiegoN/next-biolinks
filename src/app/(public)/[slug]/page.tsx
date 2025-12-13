import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { ExternalLink, ShoppingBag, MessageCircle } from "lucide-react";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await prisma.page.findUnique({
    where: { slug },
    select: { title: true, description: true },
  });

  if (!page) return { title: "Página não encontrada" };

  return {
    title: page.title,
    description: page.description || "Veja meus links e produtos",
  };
}

export default async function PublicPage({ params }: Props) {
  const { slug } = await params;

  const page = await prisma.page.findUnique({
    where: { slug },
    include: {
      links: {
        where: { isActive: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!page) {
    notFound();
  }

  prisma.page
    .update({
      where: { id: page.id },
      data: { totalViews: { increment: 1 } },
    })
    .catch(() => {});

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          {page.avatarUrl ? (
            <img
              src={page.avatarUrl}
              alt={page.title}
              className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full mx-auto bg-emerald-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {page.title.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {page.title}
            </h1>
            {page.description && (
              <p className="text-zinc-500 dark:text-zinc-400 mt-2">
                {page.description}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {page.links.map((link) => {
            let href = link.url || "#";
            let target = "_blank";

            if (link.price) {
              const message = encodeURIComponent(
                `Olá, vi no seu site o item: *${link.title}*`
              );
              href = `https://wa.me/+55${page.whatsapp}?text=${message}`;
            }

            return (
              <a
                key={link.id}
                href={href}
                target={target}
                rel="noopener noreferrer"
                className="
                  block w-full p-4 rounded-xl bg-white dark:bg-zinc-900 
                  border border-zinc-200 dark:border-zinc-800
                  hover:scale-[1.02] hover:shadow-md transition-all duration-200
                  group
                "
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-300 group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">
                      {link.price ? (
                        <ShoppingBag size={20} />
                      ) : (
                        <ExternalLink size={20} />
                      )}
                    </div>

                    <div className="text-left">
                      <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">
                        {link.title}
                      </h3>
                      {link.price && (
                        <p className="text-emerald-600 font-bold text-sm">
                          {Number(link.price).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        <footer className="mt-12 text-center text-sm text-zinc-400">
          <p>
            Feito com{" "}
            <span className="font-bold text-zinc-600 dark:text-zinc-300">
              SeuSaaS
            </span>
          </p>
          <a href="/login" className="hover:underline text-xs">
            Crie seu site grátis
          </a>
        </footer>
      </div>

      <a
        href={`https://wa.me/+55${page.whatsapp}`}
        target="_blank"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-xl hover:bg-green-600 transition-colors z-50"
      >
        <MessageCircle size={24} />
      </a>
    </main>
  );
}
