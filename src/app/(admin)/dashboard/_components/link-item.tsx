"use client";

import { Trash2, ExternalLink, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteLink } from "../links/actions";

type LinkItemProps = {
  link: {
    id: string;
    title: string;
    url: string | null;
    price: number | null;
    clicks: number;
  };
};

export function LinkItem({ link }: LinkItemProps) {
  async function handleDelete() {
    if (!confirm("Tem certeza que deseja apagar este item?")) return;

    const res = await deleteLink(link.id);
    if (res?.error) toast.error(res.error);
    else toast.success("Item removido");
  }

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-card mb-3 hover:shadow-md transition-all">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-muted rounded-full">
          {link.price ? (
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
          ) : (
            <ExternalLink className="w-5 h-5 text-blue-500" />
          )}
        </div>
        <div>
          <h4 className="font-semibold">{link.title}</h4>
          <div className="text-sm text-muted-foreground flex gap-3">
            {link.price && (
              <span className="text-emerald-600 font-medium">
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

      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
