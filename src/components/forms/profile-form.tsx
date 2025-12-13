"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Loader2, Save } from "lucide-react";
import { updatePageProfile } from "@/app/(admin)/dashboard/settings/actions";
import { createClient } from "@/lib/supabase/client";

interface ProfileFormProps {
  initialData: {
    title: string;
    description: string | null;
    whatsapp: string;
    avatarUrl: string | null;
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [uploading, setUploading] = useState(false);

  const form = useForm({
    defaultValues: {
      title: initialData.title,
      description: initialData.description || "",
      whatsapp: initialData.whatsapp,
      avatarUrl: initialData.avatarUrl,
    },
  });

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Imagem muito grande. Máximo 2MB.");
      return;
    }

    try {
      setUploading(true);
      const supabase = createClient();

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await (await supabase).storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = (await supabase).storage.from("avatars").getPublicUrl(filePath);

      form.setValue("avatarUrl", publicUrl);
      toast.success("Imagem carregada! Clique em Salvar para confirmar.");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao fazer upload da imagem.");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(data: any) {
    const res = await updatePageProfile(data);
    if (res?.error) toast.error(res.error);
    else toast.success("Perfil atualizado com sucesso!");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados da Página</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* AREA DE UPLOAD */}
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-zinc-300 flex items-center justify-center overflow-hidden bg-zinc-50 relative">
              {form.watch("avatarUrl") ? (
                <img
                  src={form.watch("avatarUrl")!}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Upload className="text-zinc-400" />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar">Logo ou Foto</Label>
              <div className="flex gap-2">
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="w-full max-w-xs"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                {uploading && <Loader2 className="animate-spin mt-2" />}
              </div>
              <p className="text-xs text-muted-foreground">
                Recomendado: 400x400px (Max 2MB)
              </p>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Nome do Negócio</Label>
            <Input {...form.register("title")} />
          </div>

          <div className="grid gap-2">
            <Label>Descrição Curta (Bio)</Label>
            <Textarea
              placeholder="Ex: Os melhores cortes da região..."
              {...form.register("description")}
            />
          </div>

          <div className="grid gap-2">
            <Label>WhatsApp (Somente números)</Label>
            <Input {...form.register("whatsapp")} />
          </div>

          <Button
            type="submit"
            disabled={form.formState.isSubmitting || uploading}
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
