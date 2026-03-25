import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-danger-soft text-danger">
        <AlertCircle size={40} />
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-semibold text-text-strong">Página não encontrada</h1>
        <p className="mt-2 max-w-sm text-sm text-text-muted">
          A página que você procura não existe ou foi movida. Verifique o endereço ou volte ao início.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-md border border-border-default bg-surface px-4 py-2 text-sm font-medium text-text-body transition-colors hover:bg-surface-soft"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover"
        >
          <Home size={16} />
          Ir ao Dashboard
        </button>
      </div>
    </div>
  );
}
