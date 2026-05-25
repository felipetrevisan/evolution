import { Button, Card, CardContent } from "@evolution/ui";
import { ArrowRight, Dumbbell, HeartPulse, Leaf, ShieldCheck, Target } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { evolutionLogoDarkUrl, evolutionLogoLightUrl } from "@/lib/brand/assets";
import { routes } from "@/lib/routes/routes";

const pillars = [
  { icon: Dumbbell, label: "Corpo" },
  { icon: Target, label: "Hábitos" },
  { icon: Leaf, label: "Nutrição" },
  { icon: HeartPulse, label: "Mente" },
  { icon: ShieldCheck, label: "Rotina" },
];

export function WelcomePanel() {
  return (
    <main className="stitch-organic-bg relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 text-center">
      <div className="absolute inset-0 bg-background/30" />
      <div className="relative z-10 flex w-full max-w-[1280px] flex-col items-center">
        <Image
          alt="Evolution System Logo"
          className="mb-8 size-32 object-contain drop-shadow-sm dark:hidden md:size-40"
          height={160}
          priority
          src={evolutionLogoLightUrl}
          unoptimized
          width={160}
        />
        <Image
          alt="Evolution System Logo"
          className="mb-8 hidden size-32 object-contain drop-shadow-sm dark:block md:size-40"
          height={160}
          priority
          src={evolutionLogoDarkUrl}
          unoptimized
          width={160}
        />
        <Card className="stitch-glass-card w-full max-w-2xl rounded-[24px] border-0 transition hover:-translate-y-1">
          <CardContent className="flex flex-col items-center gap-6 p-8 md:p-12">
            <h1 className="text-4xl font-bold leading-tight tracking-normal text-primary md:text-5xl">
              Evolution System
            </h1>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground">
              Uma experiência guiada para entender seus padrões, reduzir fricção e transformar
              intenção em rotina.
            </p>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button asChild className="h-14 rounded-full px-8 font-semibold">
                <Link href={routes.anamnesis}>
                  Começar minha jornada
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                className="h-14 rounded-full bg-secondary px-8 font-semibold text-secondary-foreground hover:bg-secondary/80"
                variant="secondary"
              >
                <Link href={routes.dashboard}>Ver painel</Link>
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-4">
              {pillars.map((pillar) => (
                <div className="group grid gap-2" key={pillar.label}>
                  <span className="grid size-12 place-items-center rounded-full bg-muted text-primary transition group-hover:bg-secondary">
                    <pillar.icon className="size-5" />
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {pillar.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="mt-12 flex items-center gap-2 rounded-full border border-border/20 bg-muted px-6 py-3 text-xs font-semibold text-muted-foreground shadow-sm">
          <ShieldCheck className="size-4 text-primary" />
          Protocolo seguro e personalizado
        </div>
      </div>
    </main>
  );
}
