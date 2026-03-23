import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import type {
  HoraExtraAprovacaoItem,
  HoraExtraHistoricoItem,
  HorasExtrasAprovacaoData,
} from '../types';
import { mockHorasExtras } from './horas-extras.mock';

const gestorPorObra: Record<string, string> = {
  'obra-1': 'Carlos Mendes',
  'obra-2': 'Patrícia Rocha',
  'obra-3': 'Renato Alves',
  'obra-4': 'Sérgio Dias',
};

export const mockHorasExtrasHistorico: HoraExtraHistoricoItem[] = [
  {
    id: 'hist-he-1',
    horaExtraId: 'he-1',
    competencia: '2026-03',
    funcionarioNome: 'João Silva',
    obraNome: 'Edifício Aurora',
    evento: 'lancada',
    dataEvento: '2026-03-18T21:10:00Z',
    responsavel: 'Encarregado da obra',
    destino: 'obra',
    descricao: 'Lançamento originado pela concretagem noturna da frente estrutural.',
  },
  {
    id: 'hist-he-2',
    horaExtraId: 'he-2',
    competencia: '2026-03',
    funcionarioNome: 'Maria Oliveira',
    obraNome: 'Edifício Aurora',
    evento: 'aprovada',
    dataEvento: '2026-03-18T14:30:00Z',
    responsavel: 'Carlos Mendes',
    destino: 'horas_extras',
    descricao: 'Aprovação liberada para seguir ao fechamento da competência.',
  },
  {
    id: 'hist-he-3',
    horaExtraId: 'he-3',
    competencia: '2026-03',
    funcionarioNome: 'Pedro Santos',
    obraNome: 'Residencial Parque',
    evento: 'fechada_para_fopag',
    dataEvento: '2026-03-19T18:00:00Z',
    responsavel: 'Patrícia Rocha',
    destino: 'fopag',
    descricao: 'Evento consolidado no fechamento para envio à folha prevista.',
  },
  {
    id: 'hist-he-4',
    horaExtraId: 'he-5',
    competencia: '2026-02',
    funcionarioNome: 'Luciana Almeida',
    obraNome: 'Torre Empresarial',
    evento: 'enviada_para_fopag',
    dataEvento: '2026-03-01T08:45:00Z',
    responsavel: 'Renato Alves',
    destino: 'fopag',
    descricao: 'Competência fechada e enviada para composição da folha.',
  },
  {
    id: 'hist-he-5',
    horaExtraId: 'he-7',
    competencia: '2026-03',
    funcionarioNome: 'Ricardo Barbosa',
    obraNome: 'Edifício Aurora',
    evento: 'rejeitada',
    dataEvento: '2026-03-13T10:15:00Z',
    responsavel: 'Sérgio Dias',
    destino: 'rh',
    descricao: 'Lançamento devolvido ao RH por divergência entre apontamento e jornada.',
  },
  {
    id: 'hist-he-6',
    horaExtraId: 'he-4',
    competencia: '2026-03',
    funcionarioNome: 'Carlos Mendes',
    obraNome: 'Ponte BR-101',
    evento: 'lancada',
    dataEvento: '2026-03-14T19:20:00Z',
    responsavel: 'Integração ponto',
    destino: 'horas_extras',
    descricao: 'Evento importado automaticamente para conferência e aprovação do gestor.',
  },
];

function prioridadePorStatus(status: string): 'alta' | 'media' | 'baixa' {
  if (status === 'pendente_aprovacao') return 'alta';
  if (status === 'digitada') return 'media';
  return 'baixa';
}

function destinoPorStatus(status: string): 'fopag' | 'financeiro' | 'obra' {
  if (status === 'fechada_para_fopag' || status === 'enviada_para_fopag') return 'fopag';
  if (status === 'aprovada') return 'financeiro';
  return 'obra';
}

export function registrarHoraExtraHistorico(entry: Omit<HoraExtraHistoricoItem, 'id' | 'dataEvento'> & { dataEvento?: string }) {
  mockHorasExtrasHistorico.unshift({
    id: `hist-he-${mockHorasExtrasHistorico.length + 1}`,
    dataEvento: entry.dataEvento ?? new Date().toISOString(),
    ...entry,
  });
}

export function getHorasExtrasAprovacaoData(competencia?: string): HorasExtrasAprovacaoData {
  const base = competencia ? mockHorasExtras.filter((item) => item.competencia === competencia) : mockHorasExtras;

  const aprovacoes: HoraExtraAprovacaoItem[] = base.map((item) => ({
    id: item.id,
    funcionarioId: item.funcionarioId,
    funcionarioNome: item.funcionarioNome,
    matricula: item.matricula,
    cargo: item.cargo,
    obraId: item.obraId,
    obraNome: item.obraNome,
    competencia: item.competencia,
    dataLancamento: item.dataLancamento,
    quantidadeHoras: item.quantidadeHoras,
    valorCalculado: item.valorCalculado,
    tipo: item.tipo,
    status: item.status,
    origem: item.origem,
    prioridade: prioridadePorStatus(item.status),
    gestorResponsavel: gestorPorObra[item.obraId] ?? 'Gestor não definido',
    integracaoDestino: destinoPorStatus(item.status),
    observacao: item.observacao,
  }));

  const historico = mockHorasExtrasHistorico.filter((item) => !competencia || item.competencia === competencia);
  const pendentes = aprovacoes.filter((item) => item.status === 'pendente_aprovacao' || item.status === 'digitada');
  const valorPendente = pendentes.reduce((acc, item) => acc + item.valorCalculado, 0);
  const obrasImpactadas = new Set(pendentes.map((item) => item.obraId)).size;

  return {
    kpis: {
      pendentes: pendentes.length,
      emRisco: pendentes.filter((item) => item.prioridade === 'alta').length,
      valorPendente,
      obrasImpactadas,
    },
    resumoCards: [
      {
        id: 'aprovacao-fluxo',
        titulo: 'Fila de aprovação',
        descricao: 'Ações pendentes para liberar integração com FOPAG e custo por obra.',
        itens: [
          { label: 'Competência foco', valor: competencia ? formatCompetencia(competencia) : 'Todas' },
          { label: 'Pendências', valor: String(pendentes.length), destaque: true },
          { label: 'Valor pendente', valor: formatCurrency(valorPendente) },
        ],
      },
      {
        id: 'aprovacao-integracao',
        titulo: 'Navegação cruzada',
        descricao: 'Pontos de conexão para auditoria entre RH, Obra, Horas Extras e FOPAG.',
        itens: [
          { label: 'RH', valor: 'Consolida funcionário e vínculo' },
          { label: 'Obra', valor: `${obrasImpactadas} obra(s) impactada(s)` },
          { label: 'FOPAG', valor: 'Recebe aprovadas/fechadas', destaque: true },
        ],
      },
    ],
    aprovacoes,
    historico,
  };
}
