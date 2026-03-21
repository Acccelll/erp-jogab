import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EmptyState, MainContent } from '@/shared/components';
import { formatCurrency } from '@/shared/lib/utils';
import { useFuncionarioHistoricoSalarial } from '../hooks';
import {
  FuncionarioWorkspaceFilters,
  FuncionarioWorkspaceResumoCard,
  FuncionarioWorkspaceSectionHeader,
  FuncionarioWorkspaceTable,
} from '../components';

const MOTIVO_LABELS = {
  admissao: 'Admissão',
  reajuste: 'Reajuste',
  promocao: 'Promoção',
  reenquadramento: 'Reenquadramento',
};

const STATUS_OPTIONS = [
  { value: 'admissao', label: 'Admissão' },
  { value: 'reajuste', label: 'Reajuste' },
  { value: 'promocao', label: 'Promoção' },
  { value: 'reenquadramento', label: 'Reenquadramento' },
];

export function FuncionarioHistoricoSalarialPage() {
  const { funcId } = useParams<{ funcId: string }>();
  const { data, isLoading, isError, refetch } = useFuncionarioHistoricoSalarial(funcId);
  const [search, setSearch] = useState('');
  const [motivo, setMotivo] = useState<string | undefined>(undefined);

  const filtered = useMemo(() => {
    const items = data?.items ?? [];
    return items.filter((item) => {
      const matchesSearch =
        !search.trim() || `${item.cargo} ${item.responsavel}`.toLowerCase().includes(search.trim().toLowerCase());
      const matchesMotivo = !motivo || item.motivo === motivo;
      return matchesSearch && matchesMotivo;
    });
  }, [data?.items, search, motivo]);

  return (
    <div className="flex flex-1 flex-col">
      <MainContent className="space-y-6">
        <FuncionarioWorkspaceSectionHeader
          title="Histórico Salarial"
          description="Evolução de remuneração e enquadramento com reflexo em provisões, FOPAG e custo da obra."
          actionLabel="Abrir FOPAG"
          actionHref="/fopag"
        />

        <FuncionarioWorkspaceFilters
          search={search}
          status={motivo}
          statusOptions={STATUS_OPTIONS}
          onSearchChange={setSearch}
          onStatusChange={setMotivo}
          onClear={() => {
            setSearch('');
            setMotivo(undefined);
          }}
          hasActiveFilters={Boolean(search || motivo)}
        />

        {isLoading && <div className="py-12 text-center text-sm text-gray-500">Carregando histórico salarial...</div>}

        {isError && (
          <EmptyState
            title="Erro ao carregar histórico salarial"
            description="Não foi possível carregar as movimentações salariais do funcionário."
            action={<button type="button" onClick={() => void refetch()} className="rounded-md bg-jogab-500 px-3 py-1.5 text-sm text-white">Tentar novamente</button>}
          />
        )}

        {!isLoading && !isError && data && (
          <>
            <section className="grid gap-4 xl:grid-cols-3">
              {data.resumoCards.map((card) => (
                <FuncionarioWorkspaceResumoCard key={card.id} card={card} />
              ))}
            </section>
            {filtered.length === 0 ? (
              <EmptyState title="Nenhuma movimentação encontrada" description="Não há histórico salarial para o filtro atual." />
            ) : (
              <FuncionarioWorkspaceTable
                columns={['Vigência', 'Motivo', 'Cargo', 'Salário', 'Responsável']}
                rows={filtered.map((item) => [
                  item.vigencia,
                  MOTIVO_LABELS[item.motivo],
                  item.cargo,
                  formatCurrency(item.salario),
                  item.responsavel,
                ])}
              />
            )}
          </>
        )}
      </MainContent>
    </div>
  );
}
