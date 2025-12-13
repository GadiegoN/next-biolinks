import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { MailCheck } from "lucide-react";

export default function CheckEmailPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-emerald-100 rounded-full dark:bg-emerald-900/30">
              <MailCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <CardTitle className="text-2xl">Cheque seu email</CardTitle>
          <CardDescription>
            Enviamos um link mágico de acesso para você.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Pode fechar esta aba. Clique no link que chegou no seu email para
            entrar automaticamente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
