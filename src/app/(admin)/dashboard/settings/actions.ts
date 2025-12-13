"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const updateSchema = z.object({
  name: z.string().min(2, "Nome muito curto").optional(),
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  whatsapp: z.string().min(10).optional(),
  avatarUrl: z.string().optional(),
});

export async function updatePageProfile(data: z.infer<typeof updateSchema>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Não autorizado" };

  try {
    if (data.name) {
      await prisma.user.update({
        where: { id: user.id },
        data: { name: data.name },
      });
    }

    await prisma.page.update({
      where: { userId: user.id },
      data: {
        title: data.title,
        description: data.description,
        whatsapp: data.whatsapp?.replace(/\D/g, ""),
        avatarUrl: data.avatarUrl,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Erro ao atualizar perfil." };
  }
}
