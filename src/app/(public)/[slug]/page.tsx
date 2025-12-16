import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import {
  ExternalLink,
  ShoppingBag,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

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

  const products = page.links.filter((item) => item.price !== null);
  const links = page.links.filter((item) => item.price === null);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-2xl space-y-10">
        <div className="text-center space-y-4">
          {page.avatarUrl ? (
            <img
              src={page.avatarUrl}
              alt={page.title}
              className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-28 h-28 rounded-full mx-auto bg-emerald-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {page.title.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {page.title}
            </h1>
            {page.description && (
              <p className="text-zinc-500 dark:text-zinc-400 mt-2 max-w-md mx-auto">
                {page.description}
              </p>
            )}
          </div>
        </div>

        {links.length > 0 && (
          <div className="space-y-3 max-w-md mx-auto w-full">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  block w-full p-4 rounded-xl bg-white dark:bg-zinc-900 
                  border border-zinc-200 dark:border-zinc-800
                  hover:scale-[1.02] hover:shadow-md transition-all duration-200
                  group
                "
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-300 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      <ExternalLink size={20} />
                    </div>
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">
                      {link.title}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {links.length > 0 && products.length > 0 && (
          <div className="flex items-center gap-4 py-2">
            <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1"></div>
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Produtos & Serviços
            </span>
            <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1"></div>
          </div>
        )}

        {products.length > 0 && (
          <div className="grid grid-cols-2 gap-4 w-full">
            {products.map((product) => {
              const message = encodeURIComponent(
                `Olá, vi no seu site o item: *${product.title}*`
              );
              const href = `https://wa.me/+55${page.whatsapp}?text=${message}`;

              return (
                <a
                  key={product.id}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex flex-col justify-between
                    p-4 rounded-2xl bg-white dark:bg-zinc-900 
                    border border-zinc-200 dark:border-zinc-800
                    hover:border-emerald-500/50 hover:shadow-lg transition-all duration-200
                    group text-left h-full
                  "
                >
                  <div className="mb-4">
                    <div className="w-10 h-10 mb-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center text-emerald-600">
                      <ShoppingBag size={20} />
                    </div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 leading-tight line-clamp-2">
                      {product.title}
                    </h3>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500 mb-1">A partir de</p>
                    <div className="flex items-end justify-between">
                      <span className="text-emerald-600 font-bold text-lg">
                        {Number(product.price).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                      <div className="bg-emerald-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity -mr-2 -mb-2">
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        <footer className="pt-12 pb-6 text-center text-sm text-zinc-400">
          <p>
            Feito com{" "}
            <span className="font-bold text-zinc-600 dark:text-zinc-300">
              BioLinks
            </span>
          </p>
          <a href="/login" className="hover:underline text-xs block mt-1">
            Crie seu site grátis
          </a>
        </footer>
      </div>

      {page.whatsapp && (
        <a
          href={`https://wa.me/+55${page.whatsapp}`}
          target="_blank"
          className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-xl hover:bg-green-600 hover:scale-110 transition-all z-50 flex items-center gap-2"
        >
          <MessageCircle size={24} />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap hidden md:inline-block">
            Fale Conosco
          </span>
        </a>
      )}
    </main>
  );
}
