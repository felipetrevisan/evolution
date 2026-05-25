import { Badge, Card, CardContent, CardHeader, CardTitle } from "@evolution/ui";
import {
  Activity,
  CreditCard,
  ListChecks,
  MessageSquareText,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  UsersRound,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { routes } from "@/lib/routes/routes";

export const adminNavItems = [
  {
    description: "Perfis, permissões e status de acesso.",
    href: routes.adminUsers,
    label: "Usuários",
    icon: UsersRound,
  },
  {
    description: "Ofertas, preços e liberação comercial.",
    href: routes.adminPlans,
    label: "Planos",
    icon: CreditCard,
  },
  {
    description: "Provedor, página de pagamento e renovação.",
    href: routes.adminPayment,
    label: "Pagamento",
    icon: WalletCards,
  },
  {
    description: "Perguntas e alternativas da triagem.",
    href: routes.adminTriage,
    label: "Triagem",
    icon: ListChecks,
  },
  {
    description: "Árvores de aprofundamento por vetor.",
    href: routes.adminInvestigation,
    label: "Investigação",
    icon: MessageSquareText,
  },
  {
    description: "Perguntas operacionais e áreas avaliadas.",
    href: routes.adminOperationalAssessment,
    label: "Autoavaliação",
    icon: SlidersHorizontal,
  },
];

export function AdminHome() {
  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Administração</p>
          <h1 className="text-3xl font-semibold">Painel administrativo</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground text-sm">
            Gerencie usuários, planos comerciais e configurações que controlam a experiência do
            Evolua.
          </p>
        </div>
        <Badge className="rounded-full bg-primary/10 px-3 py-1 text-primary">Acesso admin</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <AdminMetric
          icon={ShieldCheck}
          label="Governança"
          value="Controle central"
          description="Permissões e acesso em um só lugar."
        />
        <AdminMetric
          icon={Activity}
          label="Operação"
          value="Configuração ativa"
          description="Conteúdos usados nos fluxos da jornada."
        />
        <AdminMetric
          icon={Settings2}
          label="Gestão"
          value="Pronto para venda"
          description="Planos e usuários organizados para operação."
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {adminNavItems.map((item) => (
          <Link href={item.href} key={item.href}>
            <Card className="h-full border-border bg-card transition hover:-translate-y-0.5 hover:border-primary hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/10">
              <CardHeader>
                <div className="mb-2 grid size-11 place-items-center rounded-xl bg-secondary text-secondary-foreground">
                  <item.icon className="size-5" />
                </div>
                <CardTitle>{item.label}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {item.description}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

function AdminMetric({
  description,
  icon: Icon,
  label,
  value,
}: {
  description: string;
  icon: typeof ShieldCheck;
  label: string;
  value: string;
}) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="flex gap-4 p-5">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
          <Icon className="size-5" />
        </span>
        <div>
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
            {label}
          </p>
          <p className="mt-1 font-semibold">{value}</p>
          <p className="mt-1 text-muted-foreground text-sm">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
