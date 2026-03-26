import { formatCurrency } from '@/shared/lib/utils';
import type {
  ObraComprasItem,
  ObraContratoItem,
  ObraCronogramaItem,
  ObraDocumentoItem,
  ObraEquipeItem,
  ObraEstoqueItem,
  ObraFinanceiroItem,
  ObraMedicaoItem,
  ObraRiscoItem,
  ObraWorkspaceTabData,
} from '../types';

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
  'obra-8': [
    { id: 'cro-9', etapa: 'Piso Industrial', responsavel: 'Beatriz Costa', inicioPrevisto: '2026-03-01', fimPrevisto: '2026-04-15', percentual: 35, status: 'em_dia' },
  ],
  'obra-10': [
    { id: 'cro-10', etapa: 'Lançamento de Vigas', responsavel: 'Felipe Rocha', inicioPrevisto: '2026-03-10', fimPrevisto: '2026-05-20', percentual: 5, status: 'em_dia' },
  ],
};

const equipePorObra: Record<string, ObraEquipeItem[]> = {
  'obra-1': [
    { id: 'eq-1', nome: 'Paulo Mendes', funcao: 'Mestre de Obras', equipe: 'Campo', status: 'alocado', jornada: '44h semanais', funcionarioId: 'func-1', funcionarioNome: 'Paulo Mendes', centroCustoNome: 'CC Obra Residencial', percentual: 100 },
    { id: 'eq-2', nome: 'Renata Gomes', funcao: 'Engenheira Civil', equipe: 'Planejamento', status: 'alocado', jornada: '44h semanais', funcionarioId: 'func-2', funcionarioNome: 'Renata Gomes', centroCustoNome: 'CC Obra Residencial', percentual: 80 },
    { id: 'eq-3', nome: 'Thiago Silva', funcao: 'Armador', equipe: 'Estrutura', status: 'ferias', jornada: '44h semanais', funcionarioId: 'func-3', funcionarioNome: 'Thiago Silva', centroCustoNome: 'CC Estrutura', percentual: 100 },
  ],
  'obra-4': [
    { id: 'eq-4', nome: 'Marcos Santos', funcao: 'Coordenador de Obra', equipe: 'Gestão', status: 'alocado', jornada: '44h semanais', funcionarioId: 'func-4', funcionarioNome: 'Marcos Santos', centroCustoNome: 'CC Infraestrutura', percentual: 100 },
    { id: 'eq-5', nome: 'Luan Ferreira', funcao: 'Operador de Equipamentos', equipe: 'Infraestrutura', status: 'desmobilizando', jornada: '12x36', funcionarioId: 'func-5', funcionarioNome: 'Luan Ferreira', centroCustoNome: 'CC Infraestrutura', percentual: 60 },
  ],
  'obra-8': [
    { id: 'eq-8', nome: 'Beatriz Costa', funcao: 'Analista de Operações', equipe: 'Logística', status: 'alocado', jornada: '44h semanais', funcionarioId: 'func-13', funcionarioNome: 'Beatriz Costa', centroCustoNome: 'Logistics — Operações', percentual: 100 },
  ],
  'obra-10': [
    { id: 'eq-9', nome: 'Felipe Rocha', funcao: 'Consultor', equipe: 'Planejamento', status: 'alocado', jornada: '40h semanais', funcionarioId: 'func-16', funcionarioNome: 'Felipe Rocha', centroCustoNome: 'Viaduto — Planejamento', percentual: 100 },
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

const financeiroPorObra: Record<string, ObraFinanceiroItem[]> = {
  'obra-1': [
    { id: 'fin-1', codigo: 'TIT-2026-005', descricao: 'Reembolso contratual de mobilização', tipo: 'receber', status: 'recebido', competencia: '2026-03', valor: 38750 },
    { id: 'fin-2', codigo: 'TIT-2026-001', descricao: 'Folha administrativa rateada na obra', tipo: 'pagar', status: 'programado', competencia: '2026-03', valor: 182450.32 },
  ],
  'obra-2': [
    { id: 'fin-3', codigo: 'TIT-2026-003', descricao: 'Medição parcial do contrato CP-88', tipo: 'receber', status: 'previsto', competencia: '2026-03', valor: 245000 },
    { id: 'fin-4', codigo: 'TIT-2026-006', descricao: 'Locação de equipamentos de içamento', tipo: 'pagar', status: 'pago', competencia: '2026-03', valor: 52640 },
  ],
  'obra-8': [
    { id: 'fin-7', codigo: 'TIT-2026-040', descricao: 'Selante de Piso - Sigma', tipo: 'pagar', status: 'pago', competencia: '2026-03', valor: 9250 },
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
  const items = fallback(equipePorObra, obraId);

  return {
    items,
    resumoCards: [
      {
        id: 'equipe-alocacao',
        titulo: 'Alocação de equipe',
        descricao: 'Pessoas-chave e status atual da frente operacional da obra.',
        itens: [
          { label: 'Alocados', valor: String(items.filter((item) => item.status === 'alocado').length), destaque: true },
          { label: 'Férias', valor: String(items.filter((item) => item.status === 'ferias').length) },
          { label: 'Desmobilizando', valor: String(items.filter((item) => item.status === 'desmobilizando').length) },
        ],
      },
    ],
  };
}

export function getComprasWorkspace(obraId: string): ObraWorkspaceTabData<ObraComprasItem> {
  const items = fallback(comprasPorObra, obraId);

  return {
    items,
    resumoCards: [
      {
        id: 'compras-compromisso',
        titulo: 'Pipeline de compras',
        descricao: 'Solicitações e pedidos que afetam prazo, recebimento e integração fiscal da obra.',
        itens: [
          { label: 'Itens em cotação', valor: String(items.filter((item) => item.status === 'em_cotacao').length) },
          { label: 'Pedidos emitidos', valor: String(items.filter((item) => item.status === 'pedido_emitido').length) },
          { label: 'Valor monitorado', valor: formatCurrency(items.reduce((acc, item) => acc + item.valor, 0)), destaque: true },
        ],
      },
    ],
  };
}

export function getFinanceiroWorkspace(obraId: string): ObraWorkspaceTabData<ObraFinanceiroItem> {
  const items = fallback(financeiroPorObra, obraId);
  const saldo = items.reduce((acc, item) => acc + (item.tipo === 'receber' ? item.valor : -item.valor), 0);

  return {
    items,
    resumoCards: [
      {
        id: 'financeiro-saldo',
        titulo: 'Fluxo financeiro da obra',
        descricao: 'Visão do planejado/realizado da obra com reflexo em caixa e faturamento.',
        itens: [
          { label: 'A pagar', valor: formatCurrency(items.filter((item) => item.tipo === 'pagar').reduce((acc, item) => acc + item.valor, 0)) },
          { label: 'A receber', valor: formatCurrency(items.filter((item) => item.tipo === 'receber').reduce((acc, item) => acc + item.valor, 0)) },
          { label: 'Saldo projetado', valor: formatCurrency(saldo), destaque: true },
        ],
      },
    ],
  };
}

export function getDocumentosWorkspace(obraId: string): ObraWorkspaceTabData<ObraDocumentoItem> {
  const items = fallback(documentosPorObra, obraId);

  return {
    items,
    resumoCards: [
      {
        id: 'documentos-alerta',
        titulo: 'Governança documental',
        descricao: 'Documentos críticos da obra para conformidade, segurança e liberação operacional.',
        itens: [
          { label: 'Vigentes', valor: String(items.filter((item) => item.status === 'vigente').length) },
          { label: 'A vencer', valor: String(items.filter((item) => item.status === 'a_vencer').length), destaque: true },
          { label: 'Em análise', valor: String(items.filter((item) => item.status === 'em_analise').length) },
        ],
      },
    ],
  };
}

/* ── Contratos ── */

const contratosPorObra: Record<string, ObraContratoItem[]> = {
  'obra-1': [
    { id: 'ctr-1', codigo: 'CTR-2026-001', objeto: 'Execução da estrutura de concreto', contratado: 'Construtora Alfa', tipo: 'fornecedor', valorContrato: 1_250_000, valorAditivos: 78_000, dataInicio: '2026-01-10', dataFim: '2026-08-30', status: 'ativo' },
    { id: 'ctr-2', codigo: 'CTR-2026-002', objeto: 'Fornecimento de esquadrias', contratado: 'Alumax Ind.', tipo: 'fornecedor', valorContrato: 320_000, valorAditivos: 0, dataInicio: '2026-03-01', dataFim: '2026-06-15', status: 'em_negociacao' },
    { id: 'ctr-3', codigo: 'CTR-2026-003', objeto: 'Contrato de empreitada do cliente', contratado: 'Incorporadora XYZ', tipo: 'cliente', valorContrato: 4_500_000, valorAditivos: 150_000, dataInicio: '2025-06-01', dataFim: '2027-12-31', status: 'ativo' },
  ],
  'obra-2': [
    { id: 'ctr-4', codigo: 'CTR-2026-010', objeto: 'Subcontrato de terraplanagem', contratado: 'TerraMove', tipo: 'subcontrato', valorContrato: 580_000, valorAditivos: 22_000, dataInicio: '2026-01-15', dataFim: '2026-04-30', status: 'ativo' },
  ],
};

export function getContratosWorkspace(obraId: string): ObraWorkspaceTabData<ObraContratoItem> {
  const items = fallback(contratosPorObra, obraId);
  const valorTotal = items.reduce((acc, item) => acc + item.valorContrato + item.valorAditivos, 0);

  return {
    items,
    resumoCards: [
      {
        id: 'contratos-resumo',
        titulo: 'Contratos da obra',
        descricao: 'Panorama dos contratos vigentes, valores acumulados e aditivos.',
        itens: [
          { label: 'Contratos ativos', valor: String(items.filter((item) => item.status === 'ativo').length), destaque: true },
          { label: 'Em negociação', valor: String(items.filter((item) => item.status === 'em_negociacao').length) },
          { label: 'Valor total', valor: formatCurrency(valorTotal) },
        ],
      },
    ],
  };
}

/* ── Estoque ── */

const estoquePorObra: Record<string, ObraEstoqueItem[]> = {
  'obra-1': [
    { id: 'est-1', codigo: 'MAT-001', descricao: 'Cimento CP-II 50 kg', unidade: 'saco', saldoAtual: 320, consumoMes: 140, status: 'disponivel', almoxarife: 'José Almeida' },
    { id: 'est-2', codigo: 'MAT-002', descricao: 'Vergalhão CA-50 10mm', unidade: 'barra', saldoAtual: 18, consumoMes: 55, status: 'critico', almoxarife: 'José Almeida' },
    { id: 'est-3', codigo: 'MAT-003', descricao: 'Areia média lavada', unidade: 'm³', saldoAtual: 0, consumoMes: 30, status: 'esgotado', almoxarife: 'José Almeida' },
  ],
  'obra-2': [
    { id: 'est-4', codigo: 'MAT-010', descricao: 'Brita nº 1', unidade: 'm³', saldoAtual: 85, consumoMes: 40, status: 'disponivel', almoxarife: 'Marta Souza' },
  ],
};

export function getEstoqueWorkspace(obraId: string): ObraWorkspaceTabData<ObraEstoqueItem> {
  const items = fallback(estoquePorObra, obraId);

  return {
    items,
    resumoCards: [
      {
        id: 'estoque-resumo',
        titulo: 'Estoque da obra',
        descricao: 'Saldos e consumo mensal dos materiais alocados ao almoxarifado da obra.',
        itens: [
          { label: 'Itens cadastrados', valor: String(items.length) },
          { label: 'Críticos / esgotados', valor: String(items.filter((item) => item.status === 'critico' || item.status === 'esgotado').length), destaque: true },
          { label: 'Disponíveis', valor: String(items.filter((item) => item.status === 'disponivel').length) },
        ],
      },
    ],
  };
}

/* ── Medições ── */

const medicoesPorObra: Record<string, ObraMedicaoItem[]> = {
  'obra-1': [
    { id: 'med-1', codigo: 'MED-2026-001', descricao: 'Medição de estrutura — bloco A', competencia: '2026-03', percentualMedido: 68, valorMedido: 850_000, responsavel: 'Renata Gomes', status: 'aprovada' },
    { id: 'med-2', codigo: 'MED-2026-002', descricao: 'Medição elétrica — 1ª etapa', competencia: '2026-03', percentualMedido: 31, valorMedido: 124_600, responsavel: 'Eng. Fernanda Lima', status: 'em_apuracao' },
  ],
  'obra-2': [
    { id: 'med-3', codigo: 'MED-2026-005', descricao: 'Medição de terraplanagem', competencia: '2026-02', percentualMedido: 82, valorMedido: 475_600, responsavel: 'Ana Souza', status: 'faturada' },
    { id: 'med-4', codigo: 'MED-2026-006', descricao: 'Medição de drenagem', competencia: '2026-03', percentualMedido: 47, valorMedido: 189_300, responsavel: 'Marcelo Dias', status: 'prevista' },
  ],
};

export function getMedicoesWorkspace(obraId: string): ObraWorkspaceTabData<ObraMedicaoItem> {
  const items = fallback(medicoesPorObra, obraId);
  const valorTotal = items.reduce((acc, item) => acc + item.valorMedido, 0);

  return {
    items,
    resumoCards: [
      {
        id: 'medicoes-resumo',
        titulo: 'Medições da obra',
        descricao: 'Acompanhamento de medições contratuais, aprovações e faturamento.',
        itens: [
          { label: 'Medições no período', valor: String(items.length) },
          { label: 'Aprovadas', valor: String(items.filter((item) => item.status === 'aprovada').length), destaque: true },
          { label: 'Valor medido', valor: formatCurrency(valorTotal) },
        ],
      },
    ],
  };
}

/* ── Riscos ── */

const riscosPorObra: Record<string, ObraRiscoItem[]> = {
  'obra-1': [
    { id: 'rsk-1', codigo: 'RSK-001', titulo: 'Atraso na entrega de aço', categoria: 'Suprimentos', probabilidade: 'alta', impacto: 'alto', responsavel: 'Carlos Oliveira', status: 'em_mitigacao' },
    { id: 'rsk-2', codigo: 'RSK-002', titulo: 'Chuvas intensas no período de concretagem', categoria: 'Clima', probabilidade: 'media', impacto: 'medio', responsavel: 'Renata Gomes', status: 'identificado' },
    { id: 'rsk-3', codigo: 'RSK-003', titulo: 'Falta de mão de obra qualificada', categoria: 'RH', probabilidade: 'baixa', impacto: 'alto', responsavel: 'Paulo Mendes', status: 'mitigado' },
  ],
  'obra-2': [
    { id: 'rsk-4', codigo: 'RSK-010', titulo: 'Interferência com rede de drenagem existente', categoria: 'Projeto', probabilidade: 'media', impacto: 'alto', responsavel: 'Marcelo Dias', status: 'identificado' },
  ],
};

export function getRiscosWorkspace(obraId: string): ObraWorkspaceTabData<ObraRiscoItem> {
  const items = fallback(riscosPorObra, obraId);

  return {
    items,
    resumoCards: [
      {
        id: 'riscos-resumo',
        titulo: 'Matriz de riscos',
        descricao: 'Riscos e oportunidades com priorização por probabilidade e impacto.',
        itens: [
          { label: 'Riscos ativos', valor: String(items.filter((item) => item.status !== 'mitigado').length), destaque: true },
          { label: 'Em mitigação', valor: String(items.filter((item) => item.status === 'em_mitigacao').length) },
          { label: 'Mitigados', valor: String(items.filter((item) => item.status === 'mitigado').length) },
        ],
      },
    ],
  };
}

/* ── RH (alias de Equipe com dados estendidos) ── */

export function getRhWorkspace(obraId: string): ObraWorkspaceTabData<ObraEquipeItem> {
  return getEquipeWorkspace(obraId);
}
