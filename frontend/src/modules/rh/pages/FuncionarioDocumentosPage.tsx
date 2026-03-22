import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EmptyState, MainContent } from '@/shared/components';
import { useFuncionarioDocumentos } from '../hooks';
import {
  FuncionarioWorkspaceFilters,
  FuncionarioWorkspaceResumoCard,
  FuncionarioWorkspaceSectionHeader,
  FuncionarioWorkspaceTable,
} from '../components';

const STATUS_OPTIONS = [
  { value: 'vigente', label: 'Vigente' },
  { value: 'a_vencer', label: 'A vencer' },
  { value: 'vencido', label: 'Vencido' },
  { value: 'em_analise', label: 'Em análise' },
];

const CATEGORIA_LABELS = {
  aso: 'ASO',
  contrato: 'Contrato',
  certificado: 'Certificado',
  identificacao: 'Identificação',
};

export function FuncionarioDocumentosPage() {
  const { funcId } = useParams<{ funcId: string }>();
  const { data, isLoading, isError, refetch } = useFuncionarioDocumentos(funcId);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | undefined>(undefined);

  const filtered = useMemo(() => {
    const items = data?.items ?? [];
    return items.filter((item) => {
      const matchesSearch =
        !search.trim() || `${item.codigo} ${item.titulo} ${item.responsavel}`.toLowerCase().includes(search.trim().toLowerCase());
      const matchesStatus = !status || item.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [data?.items, search, status]);

  return (
    <div className="flex flex-1 flex-col">
      <MainContent className="space-y-6">
        <FuncionarioWorkspaceSectionHeader
          title="Documentos do Funcionário"
          description="Documentos críticos para RH, segurança do trabalho e mobilização do colaborador em obra."
          actionLabel="Abrir Documentos"
          actionHref="/documentos"
        />

        <FuncionarioWorkspaceFilters
          search={search}
          status={status}
          statusOptions={STATUS_OPTIONS}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onClear={() => {
            setSearch('');
            setStatus(undefined);
          }}
          hasActiveFilters={Boolean(search || status)}
        />

        {isLoading && <div className="py-12 text-center text-sm text-gray-500">Carregando documentos do funcionário...</div>}

        {isError && (
          <EmptyState
            title="Erro ao carregar documentos"
            description="Não foi possível carregar os documentos deste funcionário."
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
              <EmptyState title="Nenhum documento encontrado" description="Não há documentos deste funcionário para o filtro atual." />
            ) : (
              <FuncionarioWorkspaceTable
                columns={['Código', 'Título', 'Categoria', 'Status', 'Responsável', 'Vencimento']}
                rows={filtered.map((item) => [
                  item.codigo,
                  item.titulo,
                  CATEGORIA_LABELS[item.categoria],
                  STATUS_OPTIONS.find((option) => option.value === item.status)?.label ?? item.status,
                  item.responsavel,
                  item.vencimento ?? '—',
                ])}
              />
            )}
          </>
        )}
      </MainContent>
    </div>
  );
}
