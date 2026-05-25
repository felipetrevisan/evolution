"use client";

import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { routes } from "@/lib/routes/routes";
import { useAuth } from "@/providers/auth-provider";

export function useAuthActions() {
  const router = useRouter();
  const auth = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function login(email: string, password: string) {
    setLoading(true);
    setError(null);
    const loginToast = toast.loading("Entrando na sua conta...");
    try {
      await auth.login(email, password);
      toast.success("Login realizado com sucesso.", { id: loginToast });
      router.push(routes.dashboard);
    } catch (authError) {
      const message = getAuthErrorMessage(authError, "Não foi possível entrar.");
      setError(message);
      toast.error(message, { id: loginToast });
    } finally {
      setLoading(false);
    }
  }

  async function signup(email: string, password: string) {
    setLoading(true);
    setError(null);
    const signupToast = toast.loading("Criando sua conta...");
    try {
      await auth.signup(email, password);
      toast.success("Cadastro criado com sucesso.", { id: signupToast });
      router.push(routes.welcome);
    } catch (authError) {
      const message = getAuthErrorMessage(authError, "Não foi possível criar sua conta.");
      setError(message);
      toast.error(message, { id: signupToast });
    } finally {
      setLoading(false);
    }
  }

  async function loginGoogle() {
    setLoading(true);
    setError(null);
    const googleToast = toast.loading("Abrindo login com Google...");
    try {
      await auth.loginGoogle();
      toast.success("Login com Google realizado.", { id: googleToast });
      router.push(routes.dashboard);
    } catch (authError) {
      const message = getAuthErrorMessage(authError, "Não foi possível entrar com Google.");
      setError(message);
      toast.error(message, { id: googleToast });
    } finally {
      setLoading(false);
    }
  }

  async function signout() {
    setLoading(true);
    const signoutToast = toast.loading("Saindo da conta...");
    try {
      await auth.logout();
      toast.success("Sessão encerrada.", { id: signoutToast });
      router.push(routes.login);
    } catch {
      toast.error("Não foi possível sair agora.", { id: signoutToast });
    } finally {
      setLoading(false);
    }
  }

  return { login, loginGoogle, signup, signout, error, loading };
}

function getAuthErrorMessage(error: unknown, fallback: string) {
  if (!(error instanceof FirebaseError)) {
    return fallback;
  }

  const messages: Record<string, string> = {
    "auth/api-key-not-valid": "A configuração de acesso está inválida.",
    "auth/configuration-not-found": "O login ainda não está configurado para este projeto.",
    "auth/email-already-in-use": "Este e-mail já está cadastrado.",
    "auth/invalid-api-key": "A configuração de acesso está inválida.",
    "auth/invalid-credential": "E-mail ou senha inválidos.",
    "auth/invalid-email": "Digite um e-mail válido.",
    "auth/operation-not-allowed": "Este método de login ainda não está habilitado.",
    "auth/popup-closed-by-user": "Login com Google cancelado antes da conclusão.",
    "auth/too-many-requests": "Muitas tentativas. Aguarde um pouco e tente novamente.",
    "auth/user-disabled": "Esta conta foi desativada.",
    "auth/user-not-found": "Não encontramos uma conta com este e-mail.",
    "auth/weak-password": "Use uma senha com pelo menos 6 caracteres.",
    "auth/wrong-password": "Senha incorreta.",
  };

  return messages[error.code] ?? fallback;
}
