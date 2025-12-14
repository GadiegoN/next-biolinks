"use client";

import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { toast } from "sonner";

export function UpgradeButton() {
  async function handleUpgrade() {
    try {
      toast.loading("Gerando link de pagamento...");

      const response = await fetch("/api/checkout", { method: "POST" });
      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Erro ao iniciar pagamento");
      }
    } catch (error) {
      toast.error("Erro de conexão");
    }
  }

  return (
    <Button
      onClick={handleUpgrade}
      className="w-full bg-linear-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white border-0"
    >
      <Zap className="w-4 h-4 mr-2 fill-white" />
      Quero ser Premium (R$ 49,90)
    </Button>
  );
}
