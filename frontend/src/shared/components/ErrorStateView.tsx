import { AlertCircle, WifiOff, Clock, Search, ShieldAlert, Globe, RotateCcw } from 'lucide-react';
import type { ApiErrorType } from '@/shared/lib/api';
import type { ReactNode } from 'react';

interface ErrorFeedback {
  title: string;
  message: string;
  icon: ReactNode;
}

export function getErrorFeedback(type: ApiErrorType, status?: number): ErrorFeedback {
  switch (type) {
    case 'network':
      return {
        title: 'Sem conexão com a internet',
        message: 'Não foi possível estabelecer uma conexão com o servidor. Verifique sua rede.',
        icon: <WifiOff className="text-danger" size={32} />,
      };
    case 'timeout':
      return {
        title: 'Tempo de resposta excedido',
        message: 'O servidor demorou muito para responder. Tente novamente mais tarde.',
        icon: <Clock className="text-danger" size={32} />,
      };
    case 'html':
      return {
        title: 'Erro inesperado no servidor',
        message: 'Ocorreu um erro interno no servidor (500). Nossa equipe técnica foi notificada.',
        icon: <ShieldAlert className="text-danger" size={32} />,
      };
    case 'http':
      if (status === 404) {
        return {
          title: 'Recurso não encontrado',
          message: 'O conteúdo que você está procurando não existe ou foi removido.',
          icon: <Search className="text-danger" size={32} />,
        };
      }
      if (status === 403) {
        return {
          title: 'Acesso negado',
          message: 'Você não possui permissão suficiente para acessar este conteúdo.',
          icon: <ShieldAlert className="text-danger" size={32} />,
        };
      }
      return {
        title: 'Falha na requisição',
        message: `O servidor retornou um erro (${status}). Tente atualizar a página.`,
        icon: <AlertCircle className="text-danger" size={32} />,
      };
    case 'payload':
      return {
        title: 'Dados inválidos',
        message: 'O formato da resposta da API não é suportado por esta versão do ERP.',
        icon: <Globe className="text-danger" size={32} />,
      };
    default:
      return {
        title: 'Algo deu errado',
        message: 'Ocorreu um erro inesperado ao processar sua solicitação.',
        icon: <RotateCcw className="text-danger" size={32} />,
      };
  }
}

interface ErrorStateViewProps {
  type: ApiErrorType;
  status?: number;
  onRetry?: () => void;
  className?: string;
}

export function ErrorStateView({ type, status, onRetry, className }: ErrorStateViewProps) {
  const { title, message, icon } = getErrorFeedback(type, status);

  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-300 ${className}`}>
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-danger/10">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-bold text-text-strong">{title}</h3>
      <p className="mb-8 max-w-sm text-sm text-text-subtle">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 rounded-md bg-brand-primary px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-primary-hover active:scale-95 transition-all"
        >
          <RotateCcw size={16} />
          Tentar Novamente
        </button>
      )}
    </div>
  );
}
