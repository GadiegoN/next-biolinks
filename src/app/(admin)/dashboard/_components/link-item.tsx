"use client";

import { useTransition } from "react";
import { Trash2, ExternalLink, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { deleteLink, toggleLinkStatus } from "../links/actions";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

type LinkItemProps = {
  link: {
    id: string;
    title: string;
    url: string | null;
    price: number | null;
    clicks: number;
    isActive: boolean;
  };
};

export function LinkItem({ link }: LinkItemProps) {
  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja apagar este item?")) return;

    const res = await deleteLink(link.id);
    if (res?.error) toast.error(res.error);
    else toast.success("Item removido");
  }

  function handleToggle(checked: boolean) {
    startTransition(async () => {
      const res = await toggleLinkStatus(link.id, checked);
      if (res?.error) {
        toast.error(res.error);
      }
    });
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 border rounded-lg bg-card mb-3 hover:shadow-md transition-all",
        !link.isActive && "opacity-60 bg-zinc-50 dark:bg-zinc-900 border-dashed"
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "p-2 rounded-full",
            !link.isActive ? "bg-zinc-200 dark:bg-zinc-800" : "bg-muted"
          )}
        >
          {link.price ? (
            <ShoppingBag
              className={cn(
                "w-5 h-5",
                link.isActive ? "text-emerald-600" : "text-zinc-400"
              )}
            />
          ) : (
            <ExternalLink
              className={cn(
                "w-5 h-5",
                link.isActive ? "text-blue-500" : "text-zinc-400"
              )}
            />
          )}
        </div>

        <div>
          <h4
            className={cn(
              "font-semibold",
              !link.isActive && "line-through text-muted-foreground"
            )}
          >
            {link.title}
          </h4>
          <div className="text-sm text-muted-foreground flex gap-3">
            {link.price && (
              <span
                className={cn(
                  "font-medium",
                  link.isActive ? "text-emerald-600" : "text-zinc-500"
                )}
              >
                R$ {Number(link.price).toFixed(2)}
              </span>
            )}
            {link.url && (
              <span className="text-xs truncate max-w-50">{link.url}</span>
            )}
            <span className="text-xs text-zinc-400">{link.clicks} cliques</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:block">
            {link.isActive ? "Ativo" : "Oculto"}
          </span>
          <Switch
            checked={link.isActive}
            onCheckedChange={handleToggle}
            disabled={isPending}
          />
        </div>

        <div className="h-8 w-px bg-border mx-1" />

        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          className="text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
