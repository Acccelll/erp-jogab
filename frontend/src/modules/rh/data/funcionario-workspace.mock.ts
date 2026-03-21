import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import type {
  FuncionarioAlocacaoItem,
  FuncionarioContratoData,
  FuncionarioFopagItem,
  FuncionarioHorasExtrasItem,
  FuncionarioProvisaoItem,
  FuncionarioWorkspaceTabData,
} from '../types';
import { mockFuncionarios } from './funcionarios.mock';

const contratosPorFuncionario: Record<string, Omit<FuncionarioContratoData, 'resumoCards'> & { historico: FuncionarioContratoData['historico'] }> = {
  'func-1': {
    contratoId: 'CTR-RH-001',
    tipoContrato: 'CLT — prazo indeterminado',
    situacao: 'ativo',
    inicioVigencia: '2023-03-15',
    centroCusto: 'Obra Aurora — Engenharia',
    obraPrincipal: { id: 'obra-1', nome: 'Edifício Aurora' },
    gestor: 'Carlos Oliveira',
    historico: [
      { id: 'hist-1', data: '2023-03-15', tipo: 'admissao', descricao: 'Admissão no cargo de Engenheiro Civil', responsavel: 'RH Matriz' },
      { id: 'hist-2', data: '2024-01-10', tipo: 'reajuste', descricao: 'Reajuste salarial anual com atualização de função', responsavel: 'Patricia Fernandes' },
      { id: 'hist-3', data: '2025-11-01', tipo: 'aditivo', descricao: 'Aditivo de responsabilidade técnica da obra Aurora', responsavel: 'Carlos Oliveira' },
    ],
  },
  'func-2': {
    contratoId: 'CTR-RH-002',
    tipoContrato: 'CLT — prazo indeterminado',
    situacao: 'ativo',
    inicioVigencia: '2022-06-01',
    centroCusto: 'Obra Aurora — Segurança',
    obraPrincipal: { id: 'obra-1', nome: 'Edifício Aurora' },
    gestor: 'Carlos Oliveira',
    historico: [
      { id: 'hist-4', data: '2022-06-01', tipo: 'admissao', descricao: 'Admissão para suporte de segurança do trabalho', responsavel: 'RH Matriz' },
      { id: 'hist-5', data: '2024-06-01', tipo: 'reajuste', descricao: 'Revisão de piso da área de segurança', responsavel: 'Patricia Fernandes' },
    ],
  },
};

const alocacoesPorFuncionario: Record<string, FuncionarioAlocacaoItem[]> = {
  'func-1': [
    { id: 'alo-1', obraId: 'obra-1', obraNome: 'Edifício Aurora', funcao: 'Engenheiro de Obra', periodoInicio: '2023-03-15', percentual: 100, centroCusto: 'Aurora — Engenharia', status: 'ativa' },
    { id: 'alo-2', obraId: 'obra-3', obraNome: 'Torre Empresarial', funcao: 'Suporte de compatibilização', periodoInicio: '2025-08-01', periodoFim: '2025-10-15', percentual: 20, centroCusto: 'Torre — Projetos', status: 'encerrada' },
  ],
  'func-3': [
    { id: 'alo-3', obraId: 'obra-2', obraNome: 'Residencial Parque', funcao: 'Mestre de Obras', periodoInicio: '2020-01-10', percentual: 100, centroCusto: 'Parque — Produção', status: 'ativa' },
    { id: 'alo-4', obraId: 'obra-4', obraNome: 'Ponte BR-101', funcao: 'Apoio em mobilização', periodoInicio: '2026-04-01', percentual: 30, centroCusto: 'Ponte — Mobilização', status: 'planejada' },
  ],
};

const provisoesPorFuncionario: Record<string, FuncionarioProvisaoItem[]> = {
  'func-1': [
    { id: 'prov-1', competencia: '2026-01', categoria: 'ferias', status: 'consolidada', valor: 3250.45, observacao: 'Provisão regular mensal de férias' },
    { id: 'prov-2', competencia: '2026-01', categoria: 'decimo_terceiro', status: 'consolidada', valor: 1041.67, observacao: 'Apropriação 13º mensal' },
    { id: 'prov-3', competencia: '2026-02', categoria: 'fgts', status: 'consolidada', valor: 1000, observacao: 'FGTS sobre folha base' },
    { id: 'prov-4', competencia: '2026-03', categoria: 'rescisao', status: 'prevista', valor: 0, observacao: 'Sem risco rescisório relevante no período' },
  ],
  'func-4': [
    { id: 'prov-5', competencia: '2026-03', categoria: 'ferias', status: 'prevista', valor: 2440, observacao: 'Funcionária em férias no mês corrente' },
    { id: 'prov-6', competencia: '2026-03', categoria: 'decimo_terceiro', status: 'consolidada', valor: 766.67, observacao: 'Apropriação mensal padrão' },
  ],
};

const horasExtrasPorFuncionario: Record<string, FuncionarioHorasExtrasItem[]> = {
  'func-1': [
    { id: 'he-1', competencia: '2026-02', obraId: 'obra-1', obraNome: 'Edifício Aurora', tipo: 'he_50', status: 'aprovada', quantidadeHoras: 12, valorEstimado: 1640 },
    { id: 'he-2', competencia: '2026-03', obraId: 'obra-1', obraNome: 'Edifício Aurora', tipo: 'domingo', status: 'fechada_para_fopag', quantidadeHoras: 8, valorEstimado: 1460 },
  ],
  'func-3': [
    { id: 'he-3', competencia: '2026-03', obraId: 'obra-2', obraNome: 'Residencial Parque', tipo: 'he_100', status: 'pendente_aprovacao', quantidadeHoras: 6, valorEstimado: 690 },
    { id: 'he-4', competencia: '2026-03', obraId: 'obra-2', obraNome: 'Residencial Parque', tipo: 'feriado', status: 'aprovada', quantidadeHoras: 10, valorEstimado: 1250 },
  ],
};

const fopagPorFuncionario: Record<string, FuncionarioFopagItem[]> = {
  'func-1': [
    { id: 'fp-1', competencia: '2026-03', evento: 'Salário base', tipo: 'provento', origem: 'cadastro', status: 'consolidado', valor: 12500 },
    { id: 'fp-2', competencia: '2026-03', evento: 'Horas extras aprovadas', tipo: 'provento', origem: 'horas_extras', status: 'previsto', valor: 1460 },
    { id: 'fp-3', competencia: '2026-03', evento: 'FGTS base', tipo: 'base', origem: 'provisao', status: 'consolidado', valor: 1116.8 },
  ],
  'func-4': [
    { id: 'fp-4', competencia: '2026-03', evento: 'Salário base', tipo: 'provento', origem: 'cadastro', status: 'consolidado', valor: 9200 },
    { id: 'fp-5', competencia: '2026-03', evento: 'Desconto INSS', tipo: 'desconto', origem: 'manual', status: 'consolidado', valor: 1012.34 },
    { id: 'fp-6', competencia: '2026-03', evento: 'Provisão férias', tipo: 'base', origem: 'provisao', status: 'previsto', valor: 2440 },
  ],
};

function findFuncionario(funcId: string) {
  return mockFuncionarios.find((funcionario) => funcionario.id === funcId);
}

function emptyResumoCard(id: string, titulo: string, descricao: string) {
  return [{ id, titulo, descricao, itens: [{ label: 'Status', valor: 'Sem registros para este funcionário' }] }];
}

export function getFuncionarioContratoWorkspace(funcId: string): FuncionarioContratoData | null {
  const funcionario = findFuncionario(funcId);
  if (!funcionario) return null;

  const contratoBase = contratosPorFuncionario[funcId] ?? {
    contratoId: `CTR-${funcionario.matricula}`,
    tipoContrato: funcionario.tipoContrato.toUpperCase(),
    situacao: funcionario.status === 'desligado' ? 'encerrado' as const : 'ativo' as const,
    inicioVigencia: funcionario.dataAdmissao,
    centroCusto: funcionario.centroCustoNome ?? 'Sem centro de custo',
    obraPrincipal: funcionario.obraAlocadoId && funcionario.obraAlocadoNome ? { id: funcionario.obraAlocadoId, nome: funcionario.obraAlocadoNome } : undefined,
    gestor: funcionario.gestorNome ?? 'Sem gestor definido',
    historico: [
      { id: `hist-${funcionario.id}-1`, data: funcionario.dataAdmissao, tipo: 'admissao' as const, descricao: 'Admissão registrada no cadastro do funcionário', responsavel: 'RH Corporativo' },
    ],
  };

  return {
    ...contratoBase,
    resumoCards: [
      {
        id: 'contrato-vinculo',
        titulo: 'Vínculo atual',
        descricao: 'Situação contratual com reflexo em RH e apropriação de custos por obra.',
        itens: [
          { label: 'Tipo', valor: contratoBase.tipoContrato, destaque: true },
          { label: 'Centro de custo', valor: contratoBase.centroCusto },
          { label: 'Gestor', valor: contratoBase.gestor },
        ],
      },
      {
        id: 'contrato-integracao',
        titulo: 'Integrações ativas',
        descricao: 'Leitura rápida dos vínculos que alimentam Obra, Horas Extras e FOPAG.',
        itens: [
          { label: 'Obra principal', valor: contratoBase.obraPrincipal?.nome ?? 'Sem obra ativa' },
          { label: 'Horas extras', valor: 'Elegível por competência' },
          { label: 'FOPAG', valor: 'Consolida folha mensal' },
        ],
      },
    ],
  };
}

export function getFuncionarioAlocacoesWorkspace(funcId: string): FuncionarioWorkspaceTabData<FuncionarioAlocacaoItem> {
  const items = alocacoesPorFuncionario[funcId] ?? [];
  return {
    items,
    resumoCards: items.length
      ? [
          {
            id: 'alocacoes-resumo',
            titulo: 'Alocação por obra',
            descricao: 'Histórico e planejamento de alocação do funcionário em obras e centros de custo.',
            itens: [
              { label: 'Ativas', valor: String(items.filter((item) => item.status === 'ativa').length), destaque: true },
              { label: 'Planejadas', valor: String(items.filter((item) => item.status === 'planejada').length) },
              { label: 'Obras distintas', valor: String(new Set(items.map((item) => item.obraId)).size) },
            ],
          },
        ]
      : emptyResumoCard('alocacoes-resumo', 'Alocação por obra', 'Sem histórico de alocação vinculado ao funcionário.'),
  };
}

export function getFuncionarioProvisoesWorkspace(funcId: string): FuncionarioWorkspaceTabData<FuncionarioProvisaoItem> {
  const items = provisoesPorFuncionario[funcId] ?? [];
  return {
    items,
    resumoCards: items.length
      ? [
          {
            id: 'provisoes-resumo',
            titulo: 'Provisões trabalhistas',
            descricao: 'Base de provisões com reflexo na folha prevista e no financeiro da obra.',
            itens: [
              { label: 'Competências', valor: String(new Set(items.map((item) => item.competencia)).size) },
              { label: 'Valor acumulado', valor: formatCurrency(items.reduce((acc, item) => acc + item.valor, 0)), destaque: true },
              { label: 'Consolidadas', valor: String(items.filter((item) => item.status === 'consolidada').length) },
            ],
          },
        ]
      : emptyResumoCard('provisoes-resumo', 'Provisões trabalhistas', 'Sem provisões registradas para o funcionário.'),
  };
}

export function getFuncionarioHorasExtrasWorkspace(funcId: string): FuncionarioWorkspaceTabData<FuncionarioHorasExtrasItem> {
  const items = horasExtrasPorFuncionario[funcId] ?? [];
  return {
    items,
    resumoCards: items.length
      ? [
          {
            id: 'horas-extras-resumo',
            titulo: 'Integração com Horas Extras',
            descricao: 'Eventos operacionais que refletem na FOPAG e no custo da obra.',
            itens: [
              { label: 'Horas lançadas', valor: `${items.reduce((acc, item) => acc + item.quantidadeHoras, 0)}h`, destaque: true },
              { label: 'Valor estimado', valor: formatCurrency(items.reduce((acc, item) => acc + item.valorEstimado, 0)) },
              { label: 'Competência mais recente', valor: formatCompetencia(items[items.length - 1]?.competencia ?? '') },
            ],
          },
        ]
      : emptyResumoCard('horas-extras-resumo', 'Integração com Horas Extras', 'Sem lançamentos de horas extras para o funcionário.'),
  };
}

export function getFuncionarioFopagWorkspace(funcId: string): FuncionarioWorkspaceTabData<FuncionarioFopagItem> {
  const items = fopagPorFuncionario[funcId] ?? [];
  return {
    items,
    resumoCards: items.length
      ? [
          {
            id: 'fopag-resumo',
            titulo: 'Eventos de folha',
            descricao: 'Consolidação da folha prevista do funcionário por competência e origem dos eventos.',
            itens: [
              { label: 'Competência foco', valor: formatCompetencia(items[0]?.competencia ?? '') },
              { label: 'Proventos', valor: formatCurrency(items.filter((item) => item.tipo === 'provento').reduce((acc, item) => acc + item.valor, 0)), destaque: true },
              { label: 'Descontos', valor: formatCurrency(items.filter((item) => item.tipo === 'desconto').reduce((acc, item) => acc + item.valor, 0)) },
            ],
          },
        ]
      : emptyResumoCard('fopag-resumo', 'Eventos de folha', 'Sem eventos de FOPAG registrados para o funcionário.'),
  };
}
