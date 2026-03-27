import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    this.props.onReset?.();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex h-full flex-col items-center justify-center bg-surface p-8 text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-danger/10 text-danger">
            <AlertTriangle size={32} />
          </div>
          <h2 className="mb-2 text-xl font-bold text-text-strong">Algo deu errado</h2>
          <p className="mb-6 max-w-md text-sm text-text-subtle">
            Ocorreu um erro inesperado ao carregar esta seção. Por favor, tente atualizar a página ou clique no botão abaixo.
          </p>
          {this.state.error && (
            <pre className="mb-6 max-w-full overflow-auto rounded bg-surface-muted p-3 text-left text-[10px] text-text-muted">
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-brand-primary-hover active:scale-95"
          >
            <RefreshCw size={16} />
            Tentar Novamente
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
