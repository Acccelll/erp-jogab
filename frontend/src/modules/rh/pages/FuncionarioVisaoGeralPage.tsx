/**
 * FuncionarioVisaoGeralPage — Visão geral/dashboard do funcionário.
 *
 * Exibe blocos de resumo por domínio: contrato, alocação, provisões,
 * horas extras, documentos, FOPAG, férias, 13º, histórico salarial.
 *
 * Rota: /rh/funcionarios/:funcId (index route)
 * Referência: docs/06-arquitetura-de-telas.md (RH — detalhe do funcionário com abas)
 */
import { useParams } from 'react-router-dom';
import { FileSignature, DollarSign, FolderOpen, Building2, Palmtree, Gift, Wallet, Clock, Receipt } from 'lucide-react';
import { MainContent, CardSkeleton, ErrorStateView } from '@/shared/components';
import { useFuncionarioDetails } from '../hooks/useFuncionarioDetails';
import type { FuncionarioResumoBloco } from '../types';

export function FuncionarioVisaoGeralPage() {
  const { funcId } = useParams<{ funcId: string }>();
  const { funcionario, resumoBlocos, isLoading, isError, refetch } = useFuncionarioDetails(funcId);

  if (isLoading) {
    return (
      <MainContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CardSkeleton rows={4} />
          <CardSkeleton rows={4} />
          <CardSkeleton rows={4} />
          <CardSkeleton rows={4} />
          <CardSkeleton rows={4} />
          <CardSkeleton rows={4} />
        </div>
      </MainContent>
    );
  }

  if (isError || !funcionario) {
    return (
      <ErrorStateView
        type="http"
        status={404}
        onRetry={() => void refetch()}
        className="py-12"
      />
    );
  }

  return (
    <MainContent>
      {/* Resumo por domínio — blocos */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resumoBlocos.map((bloco) => (
          <ResumoBlocoCard key={bloco.titulo} bloco={bloco} />
        ))}
      </div>
    </MainContent>
  );
}

/** Card de bloco de resumo (contrato, alocação, provisões, etc.) */
function ResumoBlocoCard({ bloco }: { bloco: FuncionarioResumoBloco }) {
  const iconMap: Record<string, React.ReactNode> = {
    Contrato: <FileSignature size={16} />,
    Alocação: <Building2 size={16} />,
    Provisões: <Wallet size={16} />,
    'Horas Extras': <Clock size={16} />,
    Documentos: <FolderOpen size={16} />,
    FOPAG: <Receipt size={16} />,
    Férias: <Palmtree size={16} />,
    '13º': <Gift size={16} />,
    'Histórico Salarial': <DollarSign size={16} />,
  };

  return (
    <div className="rounded-lg border border-border-default bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-jogab-50 text-jogab-700">
          {iconMap[bloco.titulo] ?? <FileSignature size={16} />}
        </div>
        <h3 className="text-sm font-semibold text-text-strong">{bloco.titulo}</h3>
      </div>
      <ul className="space-y-2">
        {bloco.itens.map((item) => (
          <li key={item.label} className="flex items-center justify-between text-xs">
            <span className="text-text-muted">{item.label}</span>
            <span className={item.destaque ? 'font-semibold text-jogab-700' : 'font-medium text-text-body'}>
              {item.valor}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
