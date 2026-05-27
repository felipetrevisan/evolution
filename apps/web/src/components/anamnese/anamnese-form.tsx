"use client";

import { calculateBmi, classifyBmi, validateBmi } from "@evolution/domain";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Switch,
} from "@evolution/ui";
import {
  ArrowRight,
  ChevronDown,
  HeartPulse,
  PersonStanding,
  Save,
  Sparkles,
  Target,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { useSubmitAnamnese } from "@/hooks/onboarding/use-submit-anamnese";
import type { AnamnesePayload } from "@/lib/api-client";
import { routes } from "@/lib/routes/routes";
import { AnimatedCollapse } from "../shared/animated-collapse";
import {
  ageOptions,
  availabilityOptions,
  desiredResultOptions,
  experienceOptions,
  motivatorOptions,
  type SelectOption,
  sexOptions,
  weightHistoryOptions,
} from "./anamnese-options";
import { BodyMap } from "./body-map";

export function AnamneseForm() {
  const submitAnamnese = useSubmitAnamnese();
  const router = useRouter();
  const [healthOpen, setHealthOpen] = useState(false);
  const [form, setForm] = useState<AnamnesePayload>({
    biologicalSex: "feminino",
    ageRange: "25_34",
    weightKg: 70,
    heightCm: 170,
    hasHealthCondition: false,
    weeklyAvailability: "2_3h",
    experienceLevel: "iniciante",
    weightHistory: "estavel",
    desiredResult: "criar_consistencia",
    motivator: "qualidade_vida",
    femaleHealth: {
      cycleRegularity: "regular",
      hormonalUse: "nao",
      pregnancyOrBreastfeeding: "nao",
    },
  });
  const bmi = calculateBmi(form.weightKg, form.heightCm);
  const bmiCategory = classifyBmi(bmi);
  const bmiWarning = validateBmi(form.weightKg, form.heightCm).warnings[0];

  function update<T extends keyof AnamnesePayload>(key: T, value: AnamnesePayload[T]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const saveToast = toast.loading("Salvando anamnese...");
    try {
      await submitAnamnese.execute(form);
      toast.success("Anamnese salva.", { id: saveToast });
      router.push(routes.triage);
    } catch {
      toast.error("Não foi possível salvar a anamnese.", { id: saveToast });
    }
  }

  return (
    <form className="grid gap-4 lg:grid-cols-12" onSubmit={submit}>
      <Card className="stitch-page-card border-0 lg:col-span-4">
        <CardHeader>
          <div className="flex items-center gap-3">
            <PersonStanding className="size-6 text-primary" />
            <CardTitle>Dados pessoais</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <TextField label="Nome" onChange={(value) => update("fullName", value)} />
          <SelectField
            label="Faixa etária"
            onChange={(value) => update("ageRange", value as AnamnesePayload["ageRange"])}
            options={ageOptions}
            value={form.ageRange}
          />
          <SelectField
            label="Sexo biológico"
            onChange={(value) => update("biologicalSex", value as AnamnesePayload["biologicalSex"])}
            options={sexOptions}
            value={form.biologicalSex}
          />
          {form.biologicalSex === "feminino" ? (
            <FemaleHealthFields
              onChange={(femaleHealth) => update("femaleHealth", femaleHealth)}
              value={form.femaleHealth ?? {}}
            />
          ) : null}
        </CardContent>
      </Card>

      <Card className="stitch-page-card border-0 lg:col-span-8">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <PersonStanding className="size-6 text-primary" />
              <CardTitle>Composição corporal</CardTitle>
            </div>
            <span className="rounded-lg bg-tertiary px-4 py-2 text-xs font-bold text-tertiary-foreground">
              IMC estimado: {bmi.toFixed(2)}
            </span>
          </div>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-[1fr_1.1fr]">
          <BodyMap />
          <div className="grid gap-4">
            <NumberField
              label="Peso (kg)"
              onChange={(value) => {
                if (value) update("weightKg", value);
              }}
              required
              value={form.weightKg}
            />
            <NumberField
              label="Altura (cm)"
              onChange={(value) => {
                if (value) update("heightCm", value);
              }}
              required
              value={form.heightCm}
            />
            <NumberField
              label="Cintura (cm)"
              onChange={(value) => update("waistCm", value)}
              optional
              value={form.waistCm}
            />
            <NumberField
              label="Quadril (cm)"
              onChange={(value) => update("hipCm", value)}
              optional
              value={form.hipCm}
            />
            <NumberField
              label="Braço (cm)"
              onChange={(value) => update("armCm", value)}
              optional
              value={form.armCm}
            />
            <NumberField
              label="Coxa (cm)"
              onChange={(value) => update("thighCm", value)}
              optional
              value={form.thighCm}
            />
            <p className="text-muted-foreground text-xs leading-5">
              Peso e altura são necessários para estimar o IMC. As demais medidas ajudam no
              acompanhamento, mas podem ficar em branco.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="stitch-page-card border-0 lg:col-span-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <HeartPulse className="size-6 text-primary" />
            <CardTitle>Histórico e rotina</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between gap-4 rounded-xl bg-surface-container p-4 text-sm font-medium">
            <span>Possui condição de saúde, lesão ou medicação relevante?</span>
            <Switch
              checked={healthOpen}
              onCheckedChange={(next) => {
                setHealthOpen(next);
                update("hasHealthCondition", next);
              }}
            />
          </div>
          <AnimatedCollapse open={healthOpen}>
            <TextField
              label="Condição ou observação"
              onChange={(value) => update("healthConditions", value ? [value] : [])}
            />
          </AnimatedCollapse>
          <SelectField
            label="Disponibilidade semanal"
            onChange={(value) => update("weeklyAvailability", value)}
            options={availabilityOptions}
            value={form.weeklyAvailability}
          />
          <SelectField
            label="Experiência"
            onChange={(value) => update("experienceLevel", value)}
            options={experienceOptions}
            value={form.experienceLevel}
          />
          <SelectField
            label="Histórico de peso"
            onChange={(value) => update("weightHistory", value)}
            options={weightHistoryOptions}
            value={form.weightHistory}
          />
        </CardContent>
      </Card>

      <Card className="stitch-page-card border-0 lg:col-span-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Target className="size-6 text-primary" />
            <CardTitle>Resultado desejado</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <SelectField
            label="Objetivo principal"
            onChange={(value) => update("desiredResult", value)}
            options={desiredResultOptions}
            value={form.desiredResult}
          />
          <SelectField
            label="Motivador"
            onChange={(value) => update("motivator", value)}
            options={motivatorOptions}
            value={form.motivator}
          />
          <div className="rounded-xl border border-border bg-card p-4 text-sm text-card-foreground">
            <Sparkles className="mb-2 size-5 text-primary" />
            <p className="font-semibold">
              IMC {bmi.toFixed(2)} · {bmiCategory}
            </p>
            <p className="mt-1 text-muted-foreground">
              {bmiWarning ??
                "Seu ponto de partida será salvo com segurança para acompanhar sua evolução."}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="sticky bottom-4 z-10 lg:col-span-12">
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card/95 p-4 shadow-xl shadow-primary/10 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">Tudo pronto por aqui?</p>
            <p className="text-muted-foreground text-sm">
              Salve sua anamnese para liberar a Triagem Vetorial Comportamental.
            </p>
          </div>
          <Button
            className="h-12 cursor-pointer rounded-xl px-6 font-bold"
            disabled={submitAnamnese.loading}
            type="submit"
          >
            <Save className="size-4" />
            {submitAnamnese.loading ? "Salvando..." : "Salvar e continuar"}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </form>
  );
}

function FemaleHealthFields({
  onChange,
  value,
}: {
  onChange: (value: NonNullable<AnamnesePayload["femaleHealth"]>) => void;
  value: NonNullable<AnamnesePayload["femaleHealth"]>;
}) {
  return (
    <div className="grid gap-3 rounded-xl border border-border bg-secondary/60 p-4">
      <SelectField
        label="Ciclo menstrual"
        onChange={(cycleRegularity) => onChange({ ...value, cycleRegularity })}
        options={[
          { label: "Regular", value: "regular" },
          { label: "Irregular", value: "irregular" },
          { label: "Não se aplica", value: "nao_se_aplica" },
        ]}
        value={value.cycleRegularity}
      />
      <SelectField
        label="Uso hormonal"
        onChange={(hormonalUse) => onChange({ ...value, hormonalUse })}
        options={[
          { label: "Não", value: "nao" },
          { label: "Sim", value: "sim" },
        ]}
        value={value.hormonalUse}
      />
      <SelectField
        label="Gestação ou amamentação"
        onChange={(pregnancyOrBreastfeeding) => onChange({ ...value, pregnancyOrBreastfeeding })}
        options={[
          { label: "Não", value: "nao" },
          { label: "Gestante", value: "gestante" },
          { label: "Amamentando", value: "amamentando" },
        ]}
        value={value.pregnancyOrBreastfeeding}
      />
    </div>
  );
}

function SelectField({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  value: string | undefined;
}) {
  const selected = options.find((option) => option.value === value);

  return (
    <div className="grid gap-2 text-sm font-medium">
      <span>{label}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="h-12 cursor-pointer justify-between rounded-lg border border-border/40 bg-surface-container-highest px-4 text-foreground hover:bg-muted"
            type="button"
            variant="outline"
          >
            {selected?.label ?? "Selecione"}
            <ChevronDown className="size-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width]">
          {options.map((option) => (
            <DropdownMenuItem key={option.value} onClick={() => onChange(option.value)}>
              <span className="flex-1">{option.label}</span>
              {option.value === value ? <span className="size-2 rounded-full bg-primary" /> : null}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function TextField({ label, onChange }: { label: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-xs font-medium text-muted-foreground">
      {label}
      <input
        className="rounded-lg border border-border/40 bg-surface-container-highest px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
        onChange={(event) => onChange(event.target.value)}
        type="text"
      />
    </label>
  );
}

function NumberField({
  label,
  onChange,
  optional = false,
  required = false,
  value,
}: {
  label: string;
  onChange: (value: number | undefined) => void;
  optional?: boolean;
  required?: boolean;
  value: number | undefined;
}) {
  return (
    <label className="grid gap-2 text-xs font-medium text-muted-foreground">
      <span className="flex items-center justify-between gap-2">
        {label}
        {optional ? <span className="font-normal text-muted-foreground/75">Opcional</span> : null}
      </span>
      <input
        className="rounded-lg border border-border/40 bg-surface-container-highest px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
        min={required ? 1 : undefined}
        onChange={(event) => {
          const nextValue = event.target.value ? Number(event.target.value) : undefined;
          onChange(nextValue);
        }}
        required={required}
        type="number"
        value={value ?? ""}
      />
    </label>
  );
}
