import { getMockTitulosFinanceiros } from '@/modules/financeiro/data/financeiro.mock';
import { buildWorkforceFinancialSummary } from '@/shared/lib/workforceCost';
import { getAlocacoesByObraId } from '@/shared/lib/erpRelations';
import { formatCurrency } from '@/shared/lib/utils';
import type { ObraComprasItem, ObraCronogramaItem, ObraDocumentoItem, ObraEquipeItem, ObraFinanceiroItem, ObraWorkspaceTabData } from '../types';

const cronogramaPorObra: Record<string, ObraCronogramaItem[]> = {
  'obra-1': [
    { id: 'cro-1', etapa: 'Estrutura — bloco A', responsavel: 'Carlos Oliveira', inicioPrevisto: '2026-02-01', fimPrevisto: '2026-04-15', percentual: 68, status: 'em_dia' },
    { id: 'cro-2', etapa: 'Instalações elétricas', responsavel: 'Eng. Fernanda Lima', inicioPrevisto: '2026-03-10', fimPrevisto: '2026-05-20', percentual: 31, status: 'atencao' },
    { id: 'cro-3', etapa: 'Fachada externa', responsavel: 'Juliana Prado', inicioPrevisto: '2026-03-01', fimPrevisto: '2026-06-30', percentual: 18, status: 'atrasada' },
  ],
  'obra-2': [
    { id: 'cro-4', etapa: 'Terraplanagem', responsavel: 'Ana Souza', inicioPrevisto: '2026-01-15', fimPrevisto: '2026-03-30', percentual: 82, status: 'em_dia' },
    { id: 'cro-5', etapa: 'Drenagem principal', responsavel: 'Marcelo Dias', inicioPrevisto: '2026-02-20', fimPrevisto: '2026-04-25', percentual: 47, status: 'atencao' },
  ],
};

const comprasPorObra: Record<string, ObraComprasItem[]> = {
  'obra-1': [
    { id: 'comp-1', codigo: 'PC-2026-001', objeto: 'Concreto usinado para laje', fornecedor: 'Concretiza SP', status: 'aguardando_fiscal', valor: 124200, previsaoEntrega: '2026-03-24' },
    { id: 'comp-2', codigo: 'CQ-2026-010', objeto: 'Esquadrias alumínio torre A', fornecedor: 'Alumax', status: 'em_cotacao', valor: 213500, previsaoEntrega: '2026-04-08' },
  ],
  'obra-2': [
    { id: 'comp-3', codigo: 'PC-2026-014', objeto: 'Locação de plataforma elevatória', fornecedor: 'EquipRent', status: 'pedido_emitido', valor: 39200, previsaoEntrega: '2026-03-28' },
  ],
};

const documentosPorObra: Record<string, ObraDocumentoItem[]> = {
  'obra-1': [
    { id: 'doc-1', codigo: 'DOC-2026-014', titulo: 'ART de execução estrutural', tipo: 'ART', status: 'vigente', responsavel: 'Renata Gomes', vencimento: '2026-12-31' },
    { id: 'doc-2', codigo: 'DOC-2026-019', titulo: 'Laudo de andaime fachada', tipo: 'Segurança', status: 'a_vencer', responsavel: 'Paulo Mendes', vencimento: '2026-04-10' },
  ],
  'obra-4': [
    { id: 'doc-3', codigo: 'DOC-2026-031', titulo: 'Licença ambiental complementar', tipo: 'Licença', status: 'em_analise', responsavel: 'Marcos Santos', vencimento: '2026-05-22' },
    { id: 'doc-4', codigo: 'DOC-2026-037', titulo: 'Seguro operacional da frente de trabalho', tipo: 'Seguro', status: 'vigente', responsavel: 'Luan Ferreira', vencimento: '2026-11-15' },
  ],
};

function fallback<T>(record: Record<string, T[]>, obraId: string) {
  return record[obraId] ?? [];
}

export function getCronogramaWorkspace(obraId: string): ObraWorkspaceTabData<ObraCronogramaItem> {
  const items = fallback(cronogramaPorObra, obraId);
  const atraso = items.filter((item) => item.status === 'atrasada').length;

  return {
    items,
    resumoCards: [
      {
        id: 'cronograma-prazo',
        titulo: 'Prazo das etapas',
        descricao: 'Leitura rápida do cronograma físico com foco em desvios e marcos prioritários.',
        itens: [
          { label: 'Etapas mapeadas', valor: String(items.length) },
          { label: 'Em atraso', valor: String(atraso), destaque: atraso > 0 },
          { label: 'Execução média', valor: `${Math.round(items.reduce((acc, item) => acc + item.percentual, 0) / Math.max(items.length, 1))}%` },
        ],
      },
    ],
  };
}

export function getEquipeWorkspace(obraId: string): ObraWorkspaceTabData<ObraEquipeItem> {
  const items = getAlocacoesByObraId(obraId);

  return {
    items,
    resumoCards: [
      {
        id: 'equipe-alocacao',
        titulo: 'Alocação de equipe',
        descricao: 'Pessoas-chave, centros de custo e status atual da frente operacional da obra.',
        itens: [
          { label: 'Alocados', valor: String(items.filter((item) => item.status === 'ativa').length), destaque: true },
          { label: 'Planejados', valor: String(items.filter((item) => item.status === 'planejada').length) },
          { label: 'Centros de custo', valor: String(new Set(items.map((item) => item.centroCustoId)).size) },
        ],
      },
    ],
  };
}

export function getComprasWorkspace(obraId: string): ObraWorkspaceTabData<ObraComprasItem> {
  const items = fallback(comprasPorObra, obraId);
  return { items, resumoCards: [{ id: 'compras-compromisso', titulo: 'Pipeline de compras', descricao: 'Solicitações e pedidos que afetam prazo, recebimento e integração fiscal da obra.', itens: [{ label: 'Itens em cotação', valor: String(items.filter((item) => item.status === 'em_cotacao').length) }, { label: 'Pedidos emitidos', valor: String(items.filter((item) => item.status === 'pedido_emitido').length) }, { label: 'Valor monitorado', valor: formatCurrency(items.reduce((acc, item) => acc + item.valor, 0)), destaque: true }] }] };
}

export function getFinanceiroWorkspace(obraId: string, competencia = '2026-03'): ObraWorkspaceTabData<ObraFinanceiroItem> {
  const items = getMockTitulosFinanceiros({ obraId, competencia }).map((item) => ({
    id: item.id,
    codigo: item.codigo,
    descricao: item.descricao,
    tipo: item.tipo,
    status: item.status,
    competencia: item.competencia,
    valor: item.valor,
    origem: item.origem,
  }));
  const pessoal = buildWorkforceFinancialSummary(competencia).porObra.find((item) => item.obraId === obraId);
  const saldo = items.reduce((acc, item) => acc + (item.tipo === 'receber' ? item.valor : -item.valor), 0);

  return {
    items,
    resumoCards: [
      {
        id: 'financeiro-saldo',
        titulo: 'Fluxo financeiro da obra',
        descricao: 'Visão do planejado/realizado da obra com reflexo em caixa, faturamento e custo de pessoal.',
        itens: [
          { label: 'A pagar', valor: formatCurrency(items.filter((item) => item.tipo === 'pagar').reduce((acc, item) => acc + item.valor, 0)) },
          { label: 'A receber', valor: formatCurrency(items.filter((item) => item.tipo === 'receber').reduce((acc, item) => acc + item.valor, 0)) },
          { label: 'Saldo projetado', valor: formatCurrency(saldo), destaque: true },
        ],
      },
      {
        id: 'financeiro-pessoal',
        titulo: 'Custo de pessoal da obra',
        descricao: 'Reflexo direto de Horas Extras e FOPAG na leitura financeira da obra.',
        itens: [
          { label: 'HE prevista', valor: formatCurrency(pessoal?.valorHorasExtrasPrevisto ?? 0) },
          { label: 'FOPAG prevista', valor: formatCurrency(pessoal?.valorFopagPrevisto ?? 0) },
          { label: 'Previsto x realizado', valor: `${formatCurrency(pessoal?.valorPrevisto ?? 0)} / ${formatCurrency(pessoal?.valorRealizado ?? 0)}`, destaque: true },
        ],
      },
    ],
  };
}

export function getDocumentosWorkspace(obraId: string): ObraWorkspaceTabData<ObraDocumentoItem> {
  const items = fallback(documentosPorObra, obraId);
  return { items, resumoCards: [{ id: 'documentos-alerta', titulo: 'Governança documental', descricao: 'Documentos críticos da obra para conformidade, segurança e liberação operacional.', itens: [{ label: 'Vigentes', valor: String(items.filter((item) => item.status === 'vigente').length) }, { label: 'A vencer', valor: String(items.filter((item) => item.status === 'a_vencer').length), destaque: true }, { label: 'Em análise', valor: String(items.filter((item) => item.status === 'em_analise').length) }] }] };
}
