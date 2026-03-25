import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { z } from 'zod';
import { DEFAULT_LOGIN_CREDENTIALS } from '@/shared/lib/auth.service';
import { fetchContextBootstrap } from '@/shared/lib/context.service';
import { useAuthStore, useContextStore } from '@/shared/stores';

const loginSchema = z.object({
  email: z.string().email('Informe um e-mail válido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const authError = useAuthStore((state) => state.error);
  const usuario = useAuthStore((state) => state.usuario);
  const initializeContext = useContextStore((state) => state.initializeContext);

  const [email, setEmail] = useState(DEFAULT_LOGIN_CREDENTIALS.email);
  const [password, setPassword] = useState(DEFAULT_LOGIN_CREDENTIALS.password);
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError(null);

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setValidationError(parsed.error.issues[0]?.message ?? 'Dados inválidos.');
      return;
    }

    await login(parsed.data);
    const authenticatedUser = useAuthStore.getState().usuario ?? usuario;
    if (authenticatedUser) {
      const bootstrap = await fetchContextBootstrap(authenticatedUser);
      initializeContext(bootstrap);
    }

    const nextPath =
      (location.state as { from?: string } | null)?.from && (location.state as { from?: string }).from !== '/login'
        ? (location.state as { from?: string }).from!
        : '/dashboard';

    navigate(nextPath, { replace: true });
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-text-strong">Entrar no ERP JOGAB</h2>
        <p className="mt-1 text-sm text-text-muted">
          Use uma conta de demonstração para iniciar a Sprint 2 localmente.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-text-body">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-md border border-border-default px-3 py-2 text-sm text-text-strong outline-none transition focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/15"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-text-body">
            Senha
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-md border border-border-default px-3 py-2 pr-10 text-sm text-text-strong outline-none transition focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/15"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute inset-y-0 right-2 flex items-center text-text-subtle hover:text-text-muted"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {(validationError || authError) && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {validationError ?? authError}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogIn size={16} />
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="rounded-md border border-jogab-100 bg-jogab-50 p-3 text-xs text-jogab-700">
        <p className="font-semibold">Credenciais de demonstração</p>
        <p>E-mail: {DEFAULT_LOGIN_CREDENTIALS.email}</p>
        <p>Senha: {DEFAULT_LOGIN_CREDENTIALS.password}</p>
      </div>
    </div>
  );
}
