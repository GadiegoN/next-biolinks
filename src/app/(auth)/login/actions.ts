"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;

  if (!email) {
    redirect("/error");
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/auth/callback`,
    },
  });

  if (error) {
    console.error(error);
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/login/check-email");
}
