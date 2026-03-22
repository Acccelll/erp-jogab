import { getAlocacoesByFuncionarioId } from '@/shared/lib/erpRelations';
import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import type {
  FuncionarioAlocacaoItem,
  FuncionarioContratoData,
  FuncionarioDecimoTerceiroItem,
  FuncionarioDocumentoItem,
  FuncionarioFeriasItem,
  FuncionarioFopagItem,
  FuncionarioHistoricoSalarialItem,
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

const alocacoesPorFuncionario = Object.fromEntries(mockFuncionarios.map((funcionario) => [funcionario.id, getAlocacoesByFuncionarioId(funcionario.id)]));

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
          { label: 'Centro de custo', valor: contratoBase.centroCusto },
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
              { label: 'Centros de custo', valor: String(new Set(items.map((item) => item.centroCustoId)).size) },
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

const historicoSalarialPorFuncionario: Record<string, FuncionarioHistoricoSalarialItem[]> = {
  'func-1': [
    { id: 'hs-1', vigencia: '2023-03-15', motivo: 'admissao', cargo: 'Engenheiro Civil Jr.', salario: 9800, responsavel: 'RH Corporativo' },
    { id: 'hs-2', vigencia: '2024-01-10', motivo: 'reajuste', cargo: 'Engenheiro Civil Pl.', salario: 11200, responsavel: 'Patricia Fernandes' },
    { id: 'hs-3', vigencia: '2025-03-01', motivo: 'promocao', cargo: 'Engenheiro Civil Sr.', salario: 12500, responsavel: 'Carlos Oliveira' },
  ],
  'func-4': [
    { id: 'hs-4', vigencia: '2021-05-10', motivo: 'admissao', cargo: 'Assistente Administrativo', salario: 3800, responsavel: 'RH Corporativo' },
    { id: 'hs-5', vigencia: '2023-05-10', motivo: 'reajuste', cargo: 'Assistente Administrativo', salario: 4100, responsavel: 'Patricia Fernandes' },
    { id: 'hs-6', vigencia: '2025-01-15', motivo: 'reenquadramento', cargo: 'Analista Administrativo Jr.', salario: 4600, responsavel: 'Carlos Oliveira' },
  ],
};

const documentosPorFuncionario: Record<string, FuncionarioDocumentoItem[]> = {
  'func-1': [
    { id: 'doc-1', codigo: 'ASO-2025-001', titulo: 'Atestado de Saúde Ocupacional', categoria: 'aso', status: 'vigente', responsavel: 'Dr. Marcos Saúde', vencimento: '2026-03-15' },
    { id: 'doc-2', codigo: 'CTR-2023-001', titulo: 'Contrato CLT', categoria: 'contrato', status: 'vigente', responsavel: 'RH Corporativo' },
    { id: 'doc-3', codigo: 'CERT-NR35-001', titulo: 'NR-35 Trabalho em Altura', categoria: 'certificado', status: 'a_vencer', responsavel: 'SESMT', vencimento: '2026-04-30' },
  ],
  'func-3': [
    { id: 'doc-4', codigo: 'ASO-2024-003', titulo: 'Atestado de Saúde Ocupacional', categoria: 'aso', status: 'vencido', responsavel: 'Clínica Occup.', vencimento: '2025-12-01' },
    { id: 'doc-5', codigo: 'CTR-2020-003', titulo: 'Contrato CLT', categoria: 'contrato', status: 'vigente', responsavel: 'RH Corporativo' },
    { id: 'doc-6', codigo: 'ID-RG-003', titulo: 'Cópia do RG', categoria: 'identificacao', status: 'vigente', responsavel: 'RH Corporativo' },
  ],
};

const feriasPorFuncionario: Record<string, FuncionarioFeriasItem[]> = {
  'func-1': [
    { id: 'fer-1', periodoAquisitivo: '2023-03 / 2024-03', status: 'concluida', inicioGozo: '2024-07-01', fimGozo: '2024-07-30', saldoDias: 0, abono: false },
    { id: 'fer-2', periodoAquisitivo: '2024-03 / 2025-03', status: 'planejada', saldoDias: 30, abono: true },
  ],
  'func-4': [
    { id: 'fer-3', periodoAquisitivo: '2021-05 / 2022-05', status: 'concluida', inicioGozo: '2022-08-01', fimGozo: '2022-08-30', saldoDias: 0, abono: false },
    { id: 'fer-4', periodoAquisitivo: '2024-05 / 2025-05', status: 'em_gozo', inicioGozo: '2026-03-01', fimGozo: '2026-03-30', saldoDias: 30, abono: false },
  ],
};

const decimoTerceiroPorFuncionario: Record<string, FuncionarioDecimoTerceiroItem[]> = {
  'func-1': [
    { id: 'dt-1', competencia: '2025-11', etapa: 'adiantamento', status: 'pago', origem: 'folha', valor: 6250 },
    { id: 'dt-2', competencia: '2025-12', etapa: 'parcela_final', status: 'pago', origem: 'folha', valor: 6250 },
    { id: 'dt-3', competencia: '2025-12', etapa: 'encargos', status: 'pago', origem: 'provisao', valor: 1125 },
    { id: 'dt-4', competencia: '2026-11', etapa: 'adiantamento', status: 'previsto', origem: 'provisao', valor: 6250 },
  ],
  'func-4': [
    { id: 'dt-5', competencia: '2025-11', etapa: 'adiantamento', status: 'pago', origem: 'folha', valor: 4600 },
    { id: 'dt-6', competencia: '2025-12', etapa: 'parcela_final', status: 'pago', origem: 'folha', valor: 4600 },
    { id: 'dt-7', competencia: '2026-11', etapa: 'adiantamento', status: 'previsto', origem: 'provisao', valor: 4600 },
  ],
};

export function getFuncionarioHistoricoSalarialWorkspace(funcId: string): FuncionarioWorkspaceTabData<FuncionarioHistoricoSalarialItem> {
  const items = historicoSalarialPorFuncionario[funcId] ?? [];
  return {
    items,
    resumoCards: items.length
      ? [
          {
            id: 'historico-salarial-resumo',
            titulo: 'Evolução salarial',
            descricao: 'Histórico de reajustes e mudanças de cargo com reflexo em provisões e FOPAG.',
            itens: [
              { label: 'Movimentações', valor: String(items.length) },
              { label: 'Salário atual', valor: formatCurrency(items[items.length - 1]?.salario ?? 0), destaque: true },
              { label: 'Cargo atual', valor: items[items.length - 1]?.cargo ?? '—' },
            ],
          },
        ]
      : emptyResumoCard('historico-salarial-resumo', 'Evolução salarial', 'Sem histórico salarial registrado para o funcionário.'),
  };
}

export function getFuncionarioDocumentosWorkspace(funcId: string): FuncionarioWorkspaceTabData<FuncionarioDocumentoItem> {
  const items = documentosPorFuncionario[funcId] ?? [];
  return {
    items,
    resumoCards: items.length
      ? [
          {
            id: 'documentos-resumo',
            titulo: 'Documentação do colaborador',
            descricao: 'ASOs, certificados, contratos e identificações vinculados ao funcionário.',
            itens: [
              { label: 'Total', valor: String(items.length) },
              { label: 'Vigentes', valor: String(items.filter((item) => item.status === 'vigente').length), destaque: true },
              { label: 'Vencidos / A vencer', valor: String(items.filter((item) => item.status === 'vencido' || item.status === 'a_vencer').length) },
            ],
          },
        ]
      : emptyResumoCard('documentos-resumo', 'Documentação do colaborador', 'Sem documentos registrados para o funcionário.'),
  };
}

export function getFuncionarioFeriasWorkspace(funcId: string): FuncionarioWorkspaceTabData<FuncionarioFeriasItem> {
  const items = feriasPorFuncionario[funcId] ?? [];
  return {
    items,
    resumoCards: items.length
      ? [
          {
            id: 'ferias-resumo',
            titulo: 'Gestão de férias',
            descricao: 'Períodos aquisitivos, programação e saldo de férias do colaborador.',
            itens: [
              { label: 'Períodos', valor: String(items.length) },
              { label: 'Saldo disponível', valor: `${items.filter((item) => item.status === 'planejada').reduce((acc, item) => acc + item.saldoDias, 0)} dias`, destaque: true },
              { label: 'Em gozo', valor: String(items.filter((item) => item.status === 'em_gozo').length) },
            ],
          },
        ]
      : emptyResumoCard('ferias-resumo', 'Gestão de férias', 'Sem períodos de férias registrados para o funcionário.'),
  };
}

export function getFuncionarioDecimoTerceiroWorkspace(funcId: string): FuncionarioWorkspaceTabData<FuncionarioDecimoTerceiroItem> {
  const items = decimoTerceiroPorFuncionario[funcId] ?? [];
  return {
    items,
    resumoCards: items.length
      ? [
          {
            id: 'decimo-terceiro-resumo',
            titulo: '13º Salário',
            descricao: 'Etapas do 13º com reflexo em provisões, folha prevista e desembolso financeiro.',
            itens: [
              { label: 'Competências', valor: String(new Set(items.map((item) => item.competencia)).size) },
              { label: 'Total pago', valor: formatCurrency(items.filter((item) => item.status === 'pago').reduce((acc, item) => acc + item.valor, 0)), destaque: true },
              { label: 'Previsto', valor: formatCurrency(items.filter((item) => item.status === 'previsto').reduce((acc, item) => acc + item.valor, 0)) },
            ],
          },
        ]
      : emptyResumoCard('decimo-terceiro-resumo', '13º Salário', 'Sem registros de 13º salário para o funcionário.'),
  };
}
