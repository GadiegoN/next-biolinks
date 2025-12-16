"use server";

import { z } from "zod";
import { linkSchema } from "@/lib/schemas";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createLink(data: z.infer<typeof linkSchema>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Não autorizado" };

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      page: {
        include: {
          links: true,
        },
      },
      payments: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!dbUser?.page) return { error: "Página não encontrada" };

  let isPro = false;

  if (dbUser.planStatus === "LIFETIME") {
    const lastPayment = dbUser.payments[0];

    if (lastPayment) {
      const paymentDate = new Date(lastPayment.createdAt);
      const expirationDate = new Date(paymentDate);
      expirationDate.setMonth(expirationDate.getMonth() + 3);

      const now = new Date();
      if (now < expirationDate) {
        isPro = true;
      }
    } else {
      isPro = true;
    }
  }

  const currentLinks = dbUser.page.links.length;
  const MAX_FREE_LINKS = 5;

  if (!isPro && currentLinks >= MAX_FREE_LINKS) {
    return {
      error: isPro
        ? "Erro interno de validação."
        : "Seu plano de 3 meses expirou ou você atingiu o limite grátis!",
    };
  }

  try {
    await prisma.link.create({
      data: {
        pageId: dbUser.page.id,
        title: data.title,
        url: data.url || null,
        price: data.price || null,
        type: data.price ? "WHATSAPP_PRODUCT" : "LINK",
      },
    });

    revalidatePath("/dashboard/links");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Erro ao criar link" };
  }
}

export async function deleteLink(linkId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autorizado" };

  const link = await prisma.link.findFirst({
    where: { id: linkId, page: { userId: user.id } },
  });
  if (!link) return { error: "Link não encontrado" };
  await prisma.link.delete({ where: { id: linkId } });
  revalidatePath("/dashboard/links");
  return { success: true };
}

export async function toggleLinkStatus(linkId: string, isActive: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autorizado" };

  try {
    await prisma.link.update({
      where: { id: linkId, page: { userId: user.id } },
      data: { isActive: isActive },
    });
    revalidatePath("/dashboard/links");
    return { success: true };
  } catch (error) {
    return { error: "Erro ao atualizar status" };
  }
}
