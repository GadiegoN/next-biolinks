"use server";

import { z } from "zod";
import { createPageSchema } from "@/lib/schemas";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createPageAction(data: z.infer<typeof createPageSchema>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const result = createPageSchema.safeParse(data);
  if (!result.success) {
    return { error: "Dados inválidos. Verifique os campos." };
  }

  try {
    const existingSlug = await prisma.page.findUnique({
      where: { slug: result.data.slug },
    });

    if (existingSlug) {
      return { error: "Este link já está em uso. Tente outro." };
    }

    await prisma.page.create({
      data: {
        userId: user.id,
        slug: result.data.slug,
        title: result.data.title,
        whatsapp: result.data.whatsapp.replace(/\D/g, ""),
        description: result.data.description || "",
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Erro ao criar página. Tente novamente." };
  }
}
