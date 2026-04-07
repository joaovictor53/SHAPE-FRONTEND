import { redirect } from "next/navigation";
import { authClient } from "@/app/_lib/auth-client";
import { headers } from "next/headers";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { ChatAutoOpen } from "./_components/chat-auto-open";

export default async function OnboardingPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <ChatAutoOpen />

      <div className="flex h-[56px] items-center justify-between px-5">
        <p
          className="text-[22px] uppercase leading-[1.15] text-foreground"
          style={{ fontFamily: "var(--font-anton)" }}
        >
          Fit.ai
        </p>
        <Link
          href="/"
          className="rounded-full bg-primary px-4 py-2 font-heading text-sm font-semibold text-primary-foreground"
        >
          Acessar FIT.AI
        </Link>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-5 pb-10 pt-6">
        <div className="flex flex-col items-center gap-6">
          <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 ring-8 ring-primary/5">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/15">
              <Sparkles className="size-7 text-primary" />
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="font-heading text-2xl font-semibold leading-[1.15] text-foreground">
              Bem-vindo ao Coach AI
            </h1>
            <p className="font-heading text-sm leading-relaxed text-muted-foreground">
              Seu personal trainer com inteligência artificial. Vou criar um
              plano de treino personalizado para você em minutos.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3">
          <div className="flex items-start gap-3 rounded-xl bg-secondary p-4">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <span className="font-heading text-sm font-semibold text-primary">
                1
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-heading text-sm font-semibold text-foreground">
                Compartilhe seus dados
              </span>
              <span className="font-heading text-xs leading-relaxed text-muted-foreground">
                Peso, altura, idade e percentual de gordura
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-secondary p-4">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <span className="font-heading text-sm font-semibold text-primary">
                2
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-heading text-sm font-semibold text-foreground">
                Defina seus objetivos
              </span>
              <span className="font-heading text-xs leading-relaxed text-muted-foreground">
                Ganho de massa, emagrecimento ou resistência
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-secondary p-4">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <span className="font-heading text-sm font-semibold text-primary">
                3
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-heading text-sm font-semibold text-foreground">
                Receba seu plano
              </span>
              <span className="font-heading text-xs leading-relaxed text-muted-foreground">
                Plano de treino completo criado pela IA
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
