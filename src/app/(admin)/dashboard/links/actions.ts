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

  const page = await prisma.page.findUnique({
    where: { userId: user.id },
  });

  if (!page) return { error: "Página não encontrada" };

  try {
    await prisma.link.create({
      data: {
        pageId: page.id,
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
    where: {
      id: linkId,
      page: { userId: user.id },
    },
  });

  if (!link) return { error: "Link não encontrado ou permissão negada" };

  await prisma.link.delete({ where: { id: linkId } });

  revalidatePath("/dashboard/links");
  return { success: true };
}
