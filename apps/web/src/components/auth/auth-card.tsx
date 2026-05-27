"use client";

import { Button, Card, CardContent } from "@evolution/ui";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
  Trophy,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { type FormEvent, useState } from "react";
import { useAuthActions } from "@/hooks/auth/use-auth-actions";
import { authAmbientUrl, evolutionLogoDarkUrl, evolutionLogoLightUrl } from "@/lib/brand/assets";
import { routes } from "@/lib/routes/routes";

type AuthCardProps = {
  mode: "login" | "signup";
};

export function AuthCard({ mode }: AuthCardProps) {
  const { login, loginGoogle, signup, loading } = useAuthActions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const isLogin = mode === "login";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await (isLogin ? login(email, password) : signup(email, password));
  }

  return (
    <main className="flex min-h-screen overflow-hidden bg-background text-foreground">
      <section className="relative hidden flex-1 flex-col items-center justify-center overflow-hidden bg-surface-container-low px-8 lg:flex">
        <div className="absolute inset-0">
          <Image
            alt="Fundo abstrato em tons suaves de roxo"
            className="h-full w-full object-cover opacity-40 mix-blend-multiply"
            fill
            priority
            src={authAmbientUrl}
            unoptimized
          />
        </div>

        <div className="relative z-10 flex w-full max-w-2xl flex-col items-center">
          <BrandLogo className="mb-8 animate-slide-up-soft" size="lg" />
          <div
            className="mb-8 space-y-4 text-center animate-slide-up-soft"
            style={{ animationDelay: "0.1s" }}
          >
            <h1 className="text-[32px] font-semibold leading-tight tracking-normal text-primary">
              {isLogin ? "Continue sua jornada de evolução" : "Comece sua jornada de evolução"}
            </h1>
            <p className="mx-auto max-w-lg text-base leading-7 text-muted-foreground">
              Acesse seu plano personalizado, acompanhe seu progresso e siga seu ciclo de 45 dias
              com clareza e leveza.
            </p>
          </div>
          <div className="relative mt-6 h-64 w-full">
            <FloatingTag className="left-10 top-0" delay="0s" icon={Trophy} label="hábitos" />
            <FloatingTag className="right-0 top-20" delay="1.5s" icon={Target} label="corpo" />
            <FloatingTag className="bottom-10 left-20" delay="0.8s" icon={Timer} label="rotina" />
            <FloatingTag
              className="bottom-0 right-14"
              delay="2.2s"
              icon={ShieldCheck}
              label="equilíbrio emocional"
            />
            <FloatingTag
              className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              delay="3s"
              icon={Sparkles}
              label="progresso"
              strong
            />
          </div>
        </div>
      </section>

      <section className="relative z-20 flex w-full flex-col justify-center bg-card px-6 py-8 lg:w-[480px] lg:px-8">
        <div className="mb-8 flex flex-col items-center lg:hidden">
          <BrandLogo size="sm" />
        </div>

        <Card className="border-0 bg-transparent shadow-none">
          <CardContent className="grid gap-8 p-0">
            <div className="grid gap-2 animate-slide-up-soft">
              <h2 className="text-2xl font-semibold tracking-normal text-foreground">
                {isLogin ? "Entrar na sua conta" : "Criar sua conta"}
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                {isLogin
                  ? "Bem-vindo de volta. Vamos continuar de onde você parou."
                  : "Vamos preparar seu acesso para iniciar a jornada guiada."}
              </p>
            </div>

            <form className="grid gap-6" onSubmit={submit}>
              <AuthField
                autoComplete="email"
                icon="mail"
                label="E-mail"
                onChange={setEmail}
                type="email"
                value={email}
              />
              <AuthField
                autoComplete={isLogin ? "current-password" : "new-password"}
                icon="lock"
                label="Senha"
                minLength={6}
                onChange={setPassword}
                onTogglePassword={() => setShowPassword((current) => !current)}
                showToggle
                type={showPassword ? "text" : "password"}
                value={password}
              />
              {isLogin ? (
                <Link
                  className="-mt-2 justify-self-end text-xs font-semibold text-primary hover:underline"
                  href={routes.login}
                >
                  Esqueci minha senha
                </Link>
              ) : null}
              <Button
                className="h-14 rounded-xl text-base font-bold shadow-lg shadow-primary/20 active:scale-[0.98]"
                disabled={loading}
                type="submit"
              >
                {isLogin ? "Entrar" : "Criar conta"}
                <ArrowRight className="size-4" />
              </Button>
            </form>

            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium text-muted-foreground">ou</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <Button
              className="h-14 rounded-xl border-border bg-card font-semibold text-foreground hover:bg-muted"
              disabled={loading}
              onClick={loginGoogle}
              type="button"
              variant="outline"
            >
              <GoogleMark />
              Entrar com Google
            </Button>

            <footer className="space-y-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Ainda não tem uma conta?" : "Já tem uma conta?"}{" "}
                <Link
                  className="font-bold text-primary hover:underline"
                  href={isLogin ? routes.signup : routes.login}
                >
                  {isLogin ? "Criar conta" : "Entrar agora"}
                </Link>
              </p>
              <div className="border-t border-border pt-6">
                <div className="mb-1 flex items-center justify-center gap-1 text-muted-foreground">
                  <ShieldCheck className="size-4" />
                  <span className="text-xs font-medium">Conexão segura</span>
                </div>
                <p className="px-4 text-[11px] leading-relaxed text-muted-foreground">
                  Suas informações são protegidas e usadas apenas para personalizar sua jornada.
                </p>
              </div>
            </footer>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function BrandLogo({ className = "", size }: { className?: string; size: "sm" | "lg" }) {
  const isLarge = size === "lg";

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <Image
        alt="Evolution Logo"
        className={`${isLarge ? "size-24" : "size-16"} object-contain drop-shadow-xl dark:hidden`}
        height={isLarge ? 96 : 64}
        priority={isLarge}
        src={evolutionLogoLightUrl}
        unoptimized
        width={isLarge ? 96 : 64}
      />
      <Image
        alt="Evolution Logo"
        className={`${isLarge ? "size-24" : "size-16"} hidden object-contain drop-shadow-xl dark:block`}
        height={isLarge ? 96 : 64}
        priority={isLarge}
        src={evolutionLogoDarkUrl}
        unoptimized
        width={isLarge ? 96 : 64}
      />
      {isLarge ? null : <div className="mt-3 font-semibold text-2xl text-primary">Evolution</div>}
    </div>
  );
}

function FloatingTag({
  className,
  delay,
  icon: Icon,
  label,
  strong,
}: {
  className: string;
  delay: string;
  icon: typeof Sparkles;
  label: string;
  strong?: boolean;
}) {
  return (
    <div className={`absolute animate-float-soft ${className}`} style={{ animationDelay: delay }}>
      <span
        className={`stitch-auth-glass flex items-center gap-1.5 rounded-full px-6 py-2 font-semibold shadow-sm ${
          strong
            ? "border-primary/30 bg-primary-container text-white shadow-primary/20 dark:border-primary/20 dark:bg-secondary dark:text-secondary-foreground"
            : "text-primary"
        }`}
      >
        <Icon className="size-5" />
        {label}
      </span>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="var(--google-blue)"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="var(--google-green)"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="var(--google-yellow)"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="var(--google-red)"
      />
    </svg>
  );
}

function AuthField({
  autoComplete,
  icon,
  label,
  minLength,
  onChange,
  onTogglePassword,
  showToggle,
  type,
  value,
}: {
  autoComplete: string;
  icon: "mail" | "lock";
  label: string;
  minLength?: number;
  onChange: (value: string) => void;
  onTogglePassword?: () => void;
  showToggle?: boolean;
  type: string;
  value: string;
}) {
  const Icon = icon === "mail" ? Mail : LockKeyhole;
  const passwordVisible = icon === "lock" && type === "text";
  const VisibilityIcon = passwordVisible ? EyeOff : Eye;

  return (
    <label className="grid gap-1.5 text-xs font-medium text-muted-foreground">
      <span className="ml-1">{label}</span>
      <motion.span
        animate={passwordVisible ? { scale: 1.012 } : { scale: 1 }}
        className="flex h-14 items-center gap-3 rounded-xl bg-muted px-4 transition focus-within:ring-2 focus-within:ring-primary"
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        <Icon className="size-5 text-muted-foreground" />
        <motion.input
          animate={passwordVisible ? { opacity: [0.72, 1], y: [2, 0] } : { opacity: 1, y: 0 }}
          autoComplete={autoComplete}
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
          minLength={minLength}
          onChange={(event) => onChange(event.target.value)}
          placeholder={icon === "mail" ? "seuemail@exemplo.com" : "Digite sua senha"}
          required
          type={type}
          value={value}
        />
        {showToggle ? (
          <motion.button
            aria-label="Alternar visibilidade da senha"
            className="text-muted-foreground transition hover:text-primary"
            whileTap={{ rotate: -8, scale: 0.9 }}
            onClick={onTogglePassword}
            type="button"
          >
            <VisibilityIcon className="size-5" />
          </motion.button>
        ) : null}
      </motion.span>
    </label>
  );
}
