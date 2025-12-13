import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/forms/profile-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const userPage = await prisma.page.findUnique({
    where: { userId: user.id },
  });

  if (!userPage) redirect("/dashboard");

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Configurações e Aparência</h1>
      </div>

      <div className="grid gap-8">
        <ProfileForm initialData={userPage} />
      </div>
    </div>
  );
}
