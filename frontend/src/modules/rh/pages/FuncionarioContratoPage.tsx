import { useParams } from 'react-router-dom';
import { EmptyState, MainContent } from '@/shared/components';
import { useFuncionarioContrato } from '../hooks';
import {
  FuncionarioWorkspaceResumoCard,
  FuncionarioWorkspaceSectionHeader,
  FuncionarioWorkspaceTable,
} from '../components';

const SITUACAO_LABELS = {
  ativo: 'Ativo',
  em_renovacao: 'Em renovação',
  encerrado: 'Encerrado',
};

const HISTORICO_TIPO_LABELS = {
  admissao: 'Admissão',
  aditivo: 'Aditivo',
  reajuste: 'Reajuste',
  renovacao: 'Renovação',
};

export function FuncionarioContratoPage() {
  const { funcId } = useParams<{ funcId: string }>();
  const { data, isLoading, isError, refetch } = useFuncionarioContrato(funcId);

  return (
    <div className="flex flex-1 flex-col">
      <MainContent className="space-y-6">
        <FuncionarioWorkspaceSectionHeader
          title="Contrato do Funcionário"
          description="Vínculo contratual, marcos de movimentação e conexões com obra, horas extras e folha."
          actionLabel={data?.obraPrincipal ? 'Abrir obra vinculada' : undefined}
          actionHref={data?.obraPrincipal ? `/obras/${data.obraPrincipal.id}` : undefined}
        />

        {isLoading && (
          <div className="py-12 text-center text-sm text-text-muted">Carregando contrato do funcionário...</div>
        )}
        {isError && (
          <EmptyState
            title="Erro ao carregar contrato"
            description="Não foi possível carregar o vínculo contratual deste funcionário."
            action={
              <button
                type="button"
                onClick={() => void refetch()}
                className="rounded-md bg-jogab-700 px-3 py-1.5 text-sm text-white"
              >
                Tentar novamente
              </button>
            }
          />
        )}

        {!isLoading && !isError && !data && (
          <EmptyState
            title="Contrato não encontrado"
            description="Não há dados contratuais disponíveis para este funcionário."
          />
        )}

        {!isLoading && !isError && data && (
          <>
            <section className="grid gap-4 xl:grid-cols-2">
              {data.resumoCards.map((card) => (
                <FuncionarioWorkspaceResumoCard key={card.id} card={card} />
              ))}
            </section>

            <section className="rounded-xl border border-border-default bg-white p-5 shadow-sm shadow-gray-100/60">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Info label="Contrato" value={data.contratoId} />
                <Info label="Situação" value={SITUACAO_LABELS[data.situacao]} />
                <Info label="Início de vigência" value={data.inicioVigencia} />
                <Info label="Fim de vigência" value={data.fimVigencia ?? 'Prazo indeterminado'} />
              </div>
            </section>

            {(data.historico?.length ?? 0) === 0 ? (
              <EmptyState
                title="Sem movimentações contratuais"
                description="Ainda não há histórico contratual complementar para este vínculo."
              />
            ) : (
              <FuncionarioWorkspaceTable
                columns={['Data', 'Tipo', 'Descrição', 'Responsável']}
                rows={data.historico.map((item) => [
                  item.data,
                  HISTORICO_TIPO_LABELS[item.tipo],
                  item.descricao,
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-text-subtle">{label}</p>
      <p className="mt-1 text-sm font-medium text-text-strong">{value}</p>
    </div>
  );
}
