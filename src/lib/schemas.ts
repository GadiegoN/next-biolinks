import { z } from "zod";

export const createPageSchema = z.object({
  slug: z
    .string()
    .min(3, "O link deve ter pelo menos 3 letras")
    .regex(
      /^[a-z0-9-]+$/,
      "Use apenas letras minúsculas, números e traços (sem espaços)"
    ),
  title: z.string().min(3, "O nome do negócio é obrigatório"),
  whatsapp: z.string().min(10, "Digite um WhatsApp válido (ex: 11999999999)"),
  description: z.string().optional(),
});

export const linkSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  url: z.string().optional(),
  price: z.number().optional(),
});

export type CreatePageSchema = z.infer<typeof createPageSchema>;
export type LinkSchema = z.infer<typeof linkSchema>;
