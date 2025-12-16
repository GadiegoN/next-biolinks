"use client";

import { useState } from "react";
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
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Link as LinkIcon, ShoppingBag } from "lucide-react";
import { createLink } from "@/app/(admin)/dashboard/links/actions";

export function AddLinkForm() {
  const [type, setType] = useState<"LINK" | "PRODUCT">("LINK");

  const form = useForm<LinkSchema>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: "",
      url: "",
      price: undefined,
    },
  });

  function handleTypeChange(value: "LINK" | "PRODUCT") {
    setType(value);

    if (value === "LINK") {
      form.setValue("price", undefined);
    } else {
      form.setValue("url", "");
    }
  }

  async function onSubmit(data: LinkSchema) {
    try {
      const result = await createLink(data);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Item adicionado com sucesso!");
        form.reset({
          title: "",
          url: "",
          price: undefined,
        });
        // setType("LINK");
      }
    } catch (error) {
      toast.error("Erro inesperado ao criar item");
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
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-45">
                <FormLabel className="text-xs mb-2 block">
                  Tipo do Item
                </FormLabel>
                <Select
                  value={type}
                  onValueChange={(val) =>
                    handleTypeChange(val as "LINK" | "PRODUCT")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LINK">
                      <div className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4" /> Link Externo
                      </div>
                    </SelectItem>
                    <SelectItem value="PRODUCT">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4" /> Produto
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-xs">Título / Nome</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          type === "LINK"
                            ? "Ex: Meu Site"
                            : "Ex: Corte de Cabelo"
                        }
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-xs">URL de Destino</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://..."
                        {...field}
                        value={field.value || ""}
                        disabled={type === "PRODUCT"}
                        className={
                          type === "PRODUCT"
                            ? "bg-muted text-muted-foreground opacity-50"
                            : ""
                        }
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
                  <FormItem className="w-full md:w-45">
                    <FormLabel className="text-xs">Preço (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        {...field}
                        value={field.value ?? ""}
                        disabled={type === "LINK"}
                        className={
                          type === "LINK"
                            ? "bg-muted text-muted-foreground opacity-50"
                            : ""
                        }
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
            </div>

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full md:w-auto self-end mt-2 bg-emerald-600 hover:bg-emerald-700"
            >
              Adicionar {type === "LINK" ? "Link" : "Produto"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
