import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import type {
  FechamentoCompetencia,
  HoraExtraLancamento,
  HoraExtraListItem,
  HoraExtraMutationResponse,
  HoraExtraResumoCard,
  HoraExtraRegra,
  HorasExtrasFechamentoResponse,
  HorasExtrasKpis,
} from '../types';

export const mockHoraExtraRegras: HoraExtraRegra[] = [
  {
    id: 'regra-he50',
    codigo: 'HE50',
    nome: 'Hora Extra 50%',
    tipo: 'he_50',
    percentualAdicional: 50,
    exigeAprovacao: true,
    integraFopag: true,
    integraFinanceiro: true,
  },
  {
    id: 'regra-he100',
    codigo: 'HE100',
    nome: 'Hora Extra 100%',
    tipo: 'he_100',
    percentualAdicional: 100,
    exigeAprovacao: true,
    integraFopag: true,
    integraFinanceiro: true,
  },
  {
    id: 'regra-noturna',
    codigo: 'NOT',
    nome: 'Hora Extra Noturna',
    tipo: 'he_noturna',
    percentualAdicional: 70,
    exigeAprovacao: true,
    integraFopag: true,
    integraFinanceiro: true,
  },
];

export const mockHorasExtras: HoraExtraLancamento[] = [
  {
    id: 'he-1', funcionarioId: 'func-1', funcionarioNome: 'João Silva', matricula: 'MAT-001', cargo: 'Engenheiro Civil',
    obraId: 'obra-1', obraNome: 'Edifício Aurora', centroCustoId: 'cc-1', centroCustoNome: 'Obra Aurora — Engenharia', filialId: 'fil-1', filialNome: 'Matriz — São Paulo',
    competencia: '2026-03', dataLancamento: '2026-03-18', quantidadeHoras: 4.5, valorCalculado: 286.4, tipo: 'he_50', status: 'pendente_aprovacao', origem: 'obra', aprovadorNome: null, regraId: 'regra-he50', observacao: 'Concretagem noturna',
  },
  {
    id: 'he-2', funcionarioId: 'func-2', funcionarioNome: 'Maria Oliveira', matricula: 'MAT-002', cargo: 'Técnica de Segurança',
    obraId: 'obra-1', obraNome: 'Edifício Aurora', centroCustoId: 'cc-2', centroCustoNome: 'Obra Aurora — Segurança', filialId: 'fil-1', filialNome: 'Matriz — São Paulo',
    competencia: '2026-03', dataLancamento: '2026-03-17', quantidadeHoras: 2, valorCalculado: 154.2, tipo: 'he_noturna', status: 'aprovada', origem: 'rh', aprovadorNome: 'Carlos Mendes', regraId: 'regra-noturna',
  },
  {
    id: 'he-3', funcionarioId: 'func-3', funcionarioNome: 'Pedro Santos', matricula: 'MAT-003', cargo: 'Mestre de Obras',
    obraId: 'obra-2', obraNome: 'Residencial Parque', centroCustoId: 'cc-3', centroCustoNome: 'Obra Parque — Produção', filialId: 'fil-2', filialNome: 'Filial — Rio de Janeiro',
    competencia: '2026-03', dataLancamento: '2026-03-16', quantidadeHoras: 6, valorCalculado: 398.7, tipo: 'domingo', status: 'fechada_para_fopag', origem: 'obra', aprovadorNome: 'Patrícia Rocha', regraId: 'regra-he100',
  },
  {
    id: 'he-4', funcionarioId: 'func-5', funcionarioNome: 'Carlos Mendes', matricula: 'MAT-005', cargo: 'Pedreiro',
    obraId: 'obra-4', obraNome: 'Ponte BR-101', centroCustoId: 'cc-4', centroCustoNome: 'Obra Ponte — Produção', filialId: 'fil-3', filialNome: 'Filial — Belo Horizonte',
    competencia: '2026-03', dataLancamento: '2026-03-14', quantidadeHoras: 3.5, valorCalculado: 271.15, tipo: 'feriado', status: 'pendente_aprovacao', origem: 'integracao_ponto', aprovadorNome: null, regraId: 'regra-he100',
  },
  {
    id: 'he-5', funcionarioId: 'func-6', funcionarioNome: 'Luciana Almeida', matricula: 'MAT-006', cargo: 'Arquiteta',
    obraId: 'obra-3', obraNome: 'Torre Empresarial', centroCustoId: 'cc-5', centroCustoNome: 'Obra Torre — Projetos', filialId: 'fil-1', filialNome: 'Matriz — São Paulo',
    competencia: '2026-02', dataLancamento: '2026-02-26', quantidadeHoras: 5, valorCalculado: 362.5, tipo: 'he_100', status: 'enviada_para_fopag', origem: 'obra', aprovadorNome: 'Renato Alves', regraId: 'regra-he100',
  },
  {
    id: 'he-6', funcionarioId: 'func-8', funcionarioNome: 'Fernanda Costa', matricula: 'MAT-008', cargo: 'Encarregada',
    obraId: 'obra-2', obraNome: 'Residencial Parque', centroCustoId: 'cc-6', centroCustoNome: 'Obra Parque — Encarregados', filialId: 'fil-2', filialNome: 'Filial — Rio de Janeiro',
    competencia: '2026-03', dataLancamento: '2026-03-15', quantidadeHoras: 1.5, valorCalculado: 68.9, tipo: 'adicional_noturno', status: 'digitada', origem: 'rh', aprovadorNome: null, regraId: 'regra-noturna',
  },
  {
    id: 'he-7', funcionarioId: 'func-9', funcionarioNome: 'Ricardo Barbosa', matricula: 'MAT-009', cargo: 'Auxiliar de Obras',
    obraId: 'obra-1', obraNome: 'Edifício Aurora', centroCustoId: 'cc-7', centroCustoNome: 'Obra Aurora — Auxiliares', filialId: 'fil-1', filialNome: 'Matriz — São Paulo',
    competencia: '2026-03', dataLancamento: '2026-03-12', quantidadeHoras: 7, valorCalculado: 504.8, tipo: 'he_100', status: 'rejeitada', origem: 'obra', aprovadorNome: 'Sérgio Dias', regraId: 'regra-he100', observacao: 'Horas divergentes com apontamento',
  },
];

export const mockFechamentosCompetencia: FechamentoCompetencia[] = [
  {
    id: 'fech-2026-03',
    competencia: '2026-03',
    status: 'em_apuracao',
    totalLancamentos: 5,
    pendentesAprovacao: 2,
    horasTotais: 17.5,
    valorTotal: 1179.35,
    obrasImpactadas: 3,
    updatedAt: '2026-03-20T09:30:00.000Z',
  },
  {
    id: 'fech-2026-02',
    competencia: '2026-02',
    status: 'fechada_para_fopag',
    totalLancamentos: 2,
    pendentesAprovacao: 0,
    horasTotais: 8,
    valorTotal: 573.4,
    obrasImpactadas: 2,
    updatedAt: '2026-03-01T17:15:00.000Z',
  },
];

function getStatusFechamento(competencia: string): FechamentoCompetencia['status'] {
  const itens = mockHorasExtras.filter((item) => item.competencia === competencia);
  const pendentes = itens.filter((item) => item.status === 'pendente_aprovacao' || item.status === 'digitada').length;
  const fechadas = itens.filter((item) => item.status === 'fechada_para_fopag' || item.status === 'enviada_para_fopag' || item.status === 'paga').length;

  if (itens.length > 0 && fechadas === itens.length) return 'fechada_para_fopag';
  if (pendentes === 0 && itens.length > 0) return 'pronta_para_fechamento';
  if (pendentes > 0) return 'em_apuracao';
  return 'aberta';
}

export function syncFechamentoCompetencia(competencia: string) {
  const itens = mockHorasExtras.filter((item) => item.competencia === competencia);
  const fechamento = mockFechamentosCompetencia.find((item) => item.competencia === competencia);
  const payload: FechamentoCompetencia = {
    id: fechamento?.id ?? `fech-${competencia}`,
    competencia,
    status: getStatusFechamento(competencia),
    totalLancamentos: itens.length,
    pendentesAprovacao: itens.filter((item) => item.status === 'pendente_aprovacao' || item.status === 'digitada').length,
    horasTotais: itens.reduce((acc, item) => acc + item.quantidadeHoras, 0),
    valorTotal: itens.reduce((acc, item) => acc + item.valorCalculado, 0),
    obrasImpactadas: new Set(itens.map((item) => item.obraId)).size,
    updatedAt: new Date().toISOString(),
  };

  if (fechamento) {
    Object.assign(fechamento, payload);
    return fechamento;
  }

  mockFechamentosCompetencia.unshift(payload);
  return payload;
}

export function toHoraExtraListItem(item: HoraExtraLancamento): HoraExtraListItem {
  return {
    id: item.id,
    funcionarioNome: item.funcionarioNome,
    matricula: item.matricula,
    obraNome: item.obraNome,
    competencia: item.competencia,
    dataLancamento: item.dataLancamento,
    quantidadeHoras: item.quantidadeHoras,
    valorCalculado: item.valorCalculado,
    tipo: item.tipo,
    status: item.status,
    origem: item.origem,
  };
}

export function calcularHorasExtrasKpis(items: HoraExtraLancamento[]): HorasExtrasKpis {
  return {
    totalLancamentos: items.length,
    pendentesAprovacao: items.filter((item) => item.status === 'pendente_aprovacao').length,
    aprovadas: items.filter((item) => item.status === 'aprovada').length,
    fechadasParaFopag: items.filter((item) => item.status === 'fechada_para_fopag' || item.status === 'enviada_para_fopag').length,
    horasTotais: items.reduce((total, item) => total + item.quantidadeHoras, 0),
    valorTotal: items.reduce((total, item) => total + item.valorCalculado, 0),
  };
}

export function gerarHorasExtrasResumoCards(items: HoraExtraLancamento[], fechamentoAtual: FechamentoCompetencia | null): HoraExtraResumoCard[] {
  const obraMap = new Map<string, { horas: number; valor: number }>();
  const funcionarioMap = new Map<string, number>();

  items.forEach((item) => {
    const obra = obraMap.get(item.obraNome) ?? { horas: 0, valor: 0 };
    obra.horas += item.quantidadeHoras;
    obra.valor += item.valorCalculado;
    obraMap.set(item.obraNome, obra);

    funcionarioMap.set(item.funcionarioNome, (funcionarioMap.get(item.funcionarioNome) ?? 0) + item.quantidadeHoras);
  });

  const obraCritica = [...obraMap.entries()].sort((a, b) => b[1].valor - a[1].valor)[0];
  const colaboradorDestaque = [...funcionarioMap.entries()].sort((a, b) => b[1] - a[1])[0];

  return [
    {
      id: 'resumo-aprovacao',
      titulo: 'Fluxo de Aprovação',
      descricao: 'Leitura inicial do funil entre lançamento, aprovação e integração futura com FOPAG.',
      itens: [
        { label: 'Pendentes', valor: `${items.filter((item) => item.status === 'pendente_aprovacao').length}`, destaque: true },
        { label: 'Digitadas', valor: `${items.filter((item) => item.status === 'digitada').length}` },
        { label: 'Rejeitadas', valor: `${items.filter((item) => item.status === 'rejeitada').length}` },
        { label: 'Próxima etapa', valor: 'Encaminhar para FOPAG' },
      ],
    },
    {
      id: 'resumo-obra',
      titulo: 'Impacto por Obra',
      descricao: 'Concentração inicial de custo e horas extras por obra ativa.',
      itens: [
        { label: 'Obra com maior impacto', valor: obraCritica?.[0] ?? '—', destaque: true },
        { label: 'Valor associado', valor: obraCritica ? formatCurrency(obraCritica[1].valor) : 'R$ 0,00' },
        { label: 'Horas totais na obra', valor: obraCritica ? `${obraCritica[1].horas.toFixed(1)} h` : '0 h' },
        { label: 'Obras impactadas', valor: `${obraMap.size}` },
      ],
    },
    {
      id: 'resumo-fechamento',
      titulo: 'Fechamento da Competência',
      descricao: 'Resumo visual para suportar fechamento e integração com a FOPAG.',
      itens: [
        { label: 'Competência ativa', valor: fechamentoAtual ? formatCompetencia(fechamentoAtual.competencia) : '—', destaque: true },
        { label: 'Status', valor: fechamentoAtual?.status ?? 'sem apuração' },
        { label: 'Pendências', valor: `${fechamentoAtual?.pendentesAprovacao ?? 0}` },
        { label: 'Colaborador destaque', valor: colaboradorDestaque?.[0] ?? '—' },
      ],
    },
  ];
}

export function approveHoraExtraMock(id: string, aprovadorNome = 'Gestor da Competência'): HoraExtraMutationResponse {
  const lancamento = mockHorasExtras.find((item) => item.id === id);
  if (!lancamento) throw new Error('Lançamento de hora extra não encontrado.');

  lancamento.status = 'aprovada';
  lancamento.aprovadorNome = aprovadorNome;
  syncFechamentoCompetencia(lancamento.competencia);

  return { message: 'Hora extra aprovada com sucesso.', lancamento };
}

export function fecharCompetenciaMock(competencia: string): HorasExtrasFechamentoResponse {
  const itens = mockHorasExtras.filter((item) => item.competencia === competencia);
  const pendentes = itens.filter((item) => item.status === 'pendente_aprovacao' || item.status === 'digitada');

  if (pendentes.length > 0) {
    throw new Error('Ainda existem lançamentos pendentes de aprovação para esta competência.');
  }

  itens.forEach((item) => {
    if (item.status === 'aprovada') {
      item.status = 'fechada_para_fopag';
    }
  });

  const fechamento = syncFechamentoCompetencia(competencia);
  return { message: 'Competência fechada para integração com FOPAG.', fechamento };
}

mockFechamentosCompetencia.forEach((item) => {
  syncFechamentoCompetencia(item.competencia);
});
