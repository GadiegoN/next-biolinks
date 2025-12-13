"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { linkSchema, LinkSchema } from "@/lib/schemas";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { PlusCircle } from "lucide-react";
import { createLink } from "@/app/(admin)/dashboard/links/actions";

export function AddLinkForm() {
  const form = useForm<LinkSchema>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: "",
      url: "",
      price: undefined,
    },
  });

  async function onSubmit(data: LinkSchema) {
    try {
      const result = await createLink(data);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Link adicionado!");
        form.reset({
          title: "",
          url: "",
          price: undefined,
        });
      }
    } catch (error) {
      toast.error("Erro inesperado ao criar link");
    }
  }

  return (
    <Card className="mb-8 border-emerald-100 dark:border-emerald-900/50 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-emerald-600" />
          Adicionar Novo Item
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 md:flex-row md:items-start"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="Título (ex: Corte Simples)"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="URL (opcional)"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="w-full md:w-32">
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="R$ (Opcional)"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        const numberValue =
                          val === "" ? undefined : parseFloat(val);
                        field.onChange(numberValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={form.formState.isSubmitting}>
              Adicionar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
