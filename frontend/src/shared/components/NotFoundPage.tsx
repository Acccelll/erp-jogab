import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50 text-red-500">
        <AlertCircle size={40} />
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Página não encontrada</h1>
        <p className="mt-2 max-w-sm text-sm text-gray-500">
          A página que você procura não existe ou foi movida. Verifique o endereço ou volte ao início.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 rounded-md bg-jogab-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-jogab-600"
        >
          <Home size={16} />
          Ir ao Dashboard
        </button>
      </div>
    </div>
  );
}
