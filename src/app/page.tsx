import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Layout,
  Smartphone,
  Zap,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <header className="px-6 h-16 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <Zap className="text-emerald-600 fill-emerald-600 w-6 h-6" />
          <span>BioLinks</span>
        </div>
        <nav className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost">Entrar</Button>
          </Link>
          <Link href="/login">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Criar Grátis
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="py-20 px-6 text-center max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
            🚀 A ferramenta #1 para pequenos negócios
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Transforme seguidores em{" "}
            <span className="text-emerald-600">clientes no WhatsApp</span>
          </h1>

          <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
            Crie um site profissional para sua barbearia, restaurante ou serviço
            em segundos. Sem programar nada. Receba pedidos direto no seu Zap.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full h-12 text-base bg-emerald-600 hover:bg-emerald-700"
              >
                Começar Agora
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="#demo" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full h-12 text-base"
              >
                Ver Exemplo
              </Button>
            </Link>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<Smartphone className="w-8 h-8 text-emerald-600" />}
              title="100% Mobile"
              desc="Seu site carrega instantaneamente em qualquer celular. Perfeito para o Instagram."
            />

            <FeatureCard
              icon={<Layout className="w-8 h-8 text-emerald-600" />}
              title="Pedidos no WhatsApp"
              desc="Transforme cliques em mensagens prontas. O cliente clica, o WhatsApp abre preenchido."
            />

            <FeatureCard
              icon={<CheckCircle2 className="w-8 h-8 text-emerald-600" />}
              title="Fácil de Editar"
              desc="Adicione ou remova produtos em tempo real pelo seu próprio celular ou computador."
            />
          </div>
        </section>

        <section className="py-20 px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para vender mais?</h2>
          <Link href="/login">
            <Button
              size="lg"
              className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Criar minha página grátis
            </Button>
          </Link>
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-zinc-500 border-t border-zinc-200 dark:border-zinc-800">
        <p>© 2024 BioLinks. Feito para empreendedores brasileiros.</p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
      <div className="p-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
        {icon}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-zinc-500 dark:text-zinc-400">{desc}</p>
    </div>
  );
}
