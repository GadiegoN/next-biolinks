"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPageSchema, CreatePageSchema } from "@/lib/schemas";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createPageAction } from "@/app/(admin)/dashboard/actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function CreatePageForm() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<CreatePageSchema>({
    resolver: zodResolver(createPageSchema),
    defaultValues: {
      slug: "",
      title: "",
      whatsapp: "",
      description: "",
    },
  });

  async function onSubmit(data: CreatePageSchema) {
    const result = await createPageAction(data);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Página criada com sucesso!");
      setOpen(false);
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full sm:w-auto">
          Criar Minha Página
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar novo Bio Link</DialogTitle>
          <DialogDescription>
            Escolha o endereço do seu site. Isso não poderá ser alterado depois.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seu Link</FormLabel>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground text-sm">
                      meusite.com/
                    </span>
                    <FormControl>
                      <Input placeholder="barbearia-top" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Negócio</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Barbearia do Zé" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp Principal</FormLabel>
                  <FormControl>
                    <Input placeholder="11999999999" type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Criando..."
                : "Criar Página Grátis"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
