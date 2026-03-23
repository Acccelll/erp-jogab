import { getAlocacoesByObraId } from '@/shared/lib/erpRelations';
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

const contratosPorObra: Record<string, ObraContratoItem[]> = {
  'obra-1': [
    { id: 'ct-1', codigo: 'CTR-2025-004', objeto: 'Execução de estrutura e vedação do Edifício Aurora', contratado: 'Construtora Omega', tipo: 'cliente', status: 'ativo', valorContrato: 8400000, valorAditivos: 215000, dataInicio: '2025-09-01', dataFim: '2026-09-30' },
    { id: 'ct-2', codigo: 'CTR-2025-012', objeto: 'Fornecimento e instalação de esquadrias de alumínio', contratado: 'Alumax Esquadrias', tipo: 'fornecedor', status: 'ativo', valorContrato: 385000, valorAditivos: 0, dataInicio: '2026-01-15', dataFim: '2026-06-30' },
    { id: 'ct-3', codigo: 'CTR-2026-003', objeto: 'Subcontrato de instalações elétricas', contratado: 'Eletric Sul', tipo: 'subcontrato', status: 'em_negociacao', valorContrato: 210000, valorAditivos: 0, dataInicio: '2026-04-01', dataFim: '2026-08-31' },
  ],
  'obra-2': [
    { id: 'ct-4', codigo: 'CTR-2024-022', objeto: 'Urbanização do Residencial Parque Verde', contratado: 'Empreendimentos Parque', tipo: 'cliente', status: 'ativo', valorContrato: 5200000, valorAditivos: 480000, dataInicio: '2024-11-01', dataFim: '2026-07-31' },
    { id: 'ct-5', codigo: 'CTR-2025-009', objeto: 'Locação de equipamentos de terraplanagem', contratado: 'EquipRent Locações', tipo: 'fornecedor', status: 'encerrado', valorContrato: 92000, valorAditivos: 0, dataInicio: '2025-01-10', dataFim: '2026-02-28' },
  ],
  'obra-4': [
    { id: 'ct-6', codigo: 'CTR-2025-007', objeto: 'Execução da Ponte BR-101 — lote norte', contratado: 'DNIT — Contrato Federal', tipo: 'cliente', status: 'ativo', valorContrato: 21500000, valorAditivos: 1200000, dataInicio: '2025-06-01', dataFim: '2027-06-30' },
    { id: 'ct-7', codigo: 'CTR-2025-018', objeto: 'Concretagem especial de fundações', contratado: 'Fundacon Engenharia', tipo: 'subcontrato', status: 'ativo', valorContrato: 760000, valorAditivos: 95000, dataInicio: '2025-08-01', dataFim: '2026-05-31' },
  ],
};

const estoquePorObra: Record<string, ObraEstoqueItem[]> = {
  'obra-1': [
    { id: 'est-1', codigo: 'MAT-001', descricao: 'Cimento CP-II-E-32 (sc 50kg)', unidade: 'sc', saldoAtual: 420, consumoMes: 180, status: 'disponivel', almoxarife: 'Rogério Santos' },
    { id: 'est-2', codigo: 'MAT-012', descricao: 'Vergalhão CA-50 Ø12,5mm', unidade: 'kg', saldoAtual: 3800, consumoMes: 1420, status: 'disponivel', almoxarife: 'Rogério Santos' },
    { id: 'est-3', codigo: 'MAT-024', descricao: 'Fio elétrico 2,5mm² rolo', unidade: 'rl', saldoAtual: 12, consumoMes: 9, status: 'critico', almoxarife: 'Rogério Santos' },
    { id: 'est-4', codigo: 'MAT-031', descricao: 'Tela de proteção fachada (m²)', unidade: 'm²', saldoAtual: 0, consumoMes: 120, status: 'esgotado', almoxarife: 'Rogério Santos' },
  ],
  'obra-2': [
    { id: 'est-5', codigo: 'MAT-005', descricao: 'Pedra brita nº1 (m³)', unidade: 'm³', saldoAtual: 85, consumoMes: 22, status: 'disponivel', almoxarife: 'Carla Mota' },
    { id: 'est-6', codigo: 'MAT-008', descricao: 'Tubo PVC DN150 (6m)', unidade: 'pc', saldoAtual: 8, consumoMes: 14, status: 'critico', almoxarife: 'Carla Mota' },
  ],
  'obra-4': [
    { id: 'est-7', codigo: 'MAT-042', descricao: 'Concreto fck 35 MPa (m³)', unidade: 'm³', saldoAtual: 210, consumoMes: 90, status: 'disponivel', almoxarife: 'Sandro Lima' },
    { id: 'est-8', codigo: 'MAT-051', descricao: 'Cabo de protensão (kg)', unidade: 'kg', saldoAtual: 4200, consumoMes: 980, status: 'disponivel', almoxarife: 'Sandro Lima' },
  ],
};

const medicoesPorObra: Record<string, ObraMedicaoItem[]> = {
  'obra-1': [
    { id: 'med-1', codigo: 'MED-2026-001', descricao: 'Medição parcial — estrutura bloco A', competencia: '2026-02', percentualMedido: 28, valorMedido: 1190400, status: 'faturada', responsavel: 'Arq. Ricardo Melo' },
    { id: 'med-2', codigo: 'MED-2026-005', descricao: 'Medição parcial — instalações prediais', competencia: '2026-03', percentualMedido: 14, valorMedido: 595200, status: 'aprovada', responsavel: 'Eng. Fernanda Lima' },
    { id: 'med-3', codigo: 'MED-2026-008', descricao: 'Medição prevista — fachada externa', competencia: '2026-04', percentualMedido: 8, valorMedido: 340000, status: 'prevista', responsavel: 'Juliana Prado' },
  ],
  'obra-2': [
    { id: 'med-4', codigo: 'MED-2025-041', descricao: 'Medição final — terraplanagem', competencia: '2026-03', percentualMedido: 100, valorMedido: 382500, status: 'faturada', responsavel: 'Ana Souza' },
    { id: 'med-5', codigo: 'MED-2026-002', descricao: 'Medição parcial — drenagem', competencia: '2026-03', percentualMedido: 34, valorMedido: 128000, status: 'em_apuracao', responsavel: 'Marcelo Dias' },
  ],
  'obra-4': [
    { id: 'med-6', codigo: 'MED-2025-061', descricao: 'Medição — fundações especiais lote N', competencia: '2025-12', percentualMedido: 100, valorMedido: 760000, status: 'faturada', responsavel: 'Eng. Paulo Teixeira' },
    { id: 'med-7', codigo: 'MED-2026-003', descricao: 'Medição parcial — superestrutura', competencia: '2026-03', percentualMedido: 22, valorMedido: 2150000, status: 'em_apuracao', responsavel: 'Eng. Paulo Teixeira' },
  ],
};

const riscosPorObra: Record<string, ObraRiscoItem[]> = {
  'obra-1': [
    { id: 'rsc-1', codigo: 'RSC-001', titulo: 'Atraso no fornecimento de esquadrias', categoria: 'Prazo', probabilidade: 'alta', impacto: 'medio', status: 'em_mitigacao', responsavel: 'Arq. Ricardo Melo', prazoResposta: '2026-04-15' },
    { id: 'rsc-2', codigo: 'RSC-002', titulo: 'Variação de preço do aço', categoria: 'Custo', probabilidade: 'media', impacto: 'alto', status: 'identificado', responsavel: 'Eng. Fernanda Lima', prazoResposta: '2026-03-31' },
    { id: 'rsc-3', codigo: 'RSC-003', titulo: 'Interferência de redes de concessionárias', categoria: 'Técnico', probabilidade: 'baixa', impacto: 'alto', status: 'identificado', responsavel: 'Carlos Oliveira', prazoResposta: '2026-05-01' },
  ],
  'obra-2': [
    { id: 'rsc-4', codigo: 'RSC-004', titulo: 'Chuvas intensas comprometendo prazo de drenagem', categoria: 'Ambiental', probabilidade: 'alta', impacto: 'medio', status: 'materializado', responsavel: 'Ana Souza', prazoResposta: '2026-04-30' },
  ],
  'obra-4': [
    { id: 'rsc-5', codigo: 'RSC-005', titulo: 'Restrições de tráfego na BR-101', categoria: 'Legal/Licenças', probabilidade: 'media', impacto: 'alto', status: 'em_mitigacao', responsavel: 'Eng. Paulo Teixeira', prazoResposta: '2026-06-01' },
    { id: 'rsc-6', codigo: 'RSC-006', titulo: 'Instabilidade de fundações por nível freático', categoria: 'Técnico', probabilidade: 'alta', impacto: 'alto', status: 'mitigado', responsavel: 'Eng. Paulo Teixeira', prazoResposta: '2026-03-15' },
  ],
};

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

export function getContratosWorkspace(obraId: string): ObraWorkspaceTabData<ObraContratoItem> {
  const items = fallback(contratosPorObra, obraId);
  return {
    items,
    resumoCards: [
      {
        id: 'contratos-resumo',
        titulo: 'Contratos da obra',
        descricao: 'Bloco inicial de contratos técnicos e aditivos com leitura pronta para futura API.',
        itens: [
          { label: 'Vigentes', valor: String(items.filter((item) => item.status === 'vigente').length), destaque: true },
          { label: 'Em aprovação', valor: String(items.filter((item) => item.status === 'em_aprovacao').length) },
          { label: 'Valor monitorado', valor: formatCurrency(items.reduce((acc, item) => acc + item.valor, 0)) },
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

export function getFinanceiroWorkspace(obraId: string): ObraWorkspaceTabData<ObraFinanceiroItem> {
  const items = fallback(financeiroPorObra, obraId);
  const saldo = items.reduce((acc, item) => acc + (item.tipo === 'receber' ? item.valor : -item.valor), 0);
  return { items, resumoCards: [{ id: 'financeiro-saldo', titulo: 'Fluxo financeiro da obra', descricao: 'Visão do planejado/realizado da obra com reflexo em caixa e faturamento.', itens: [{ label: 'A pagar', valor: formatCurrency(items.filter((item) => item.tipo === 'pagar').reduce((acc, item) => acc + item.valor, 0)) }, { label: 'A receber', valor: formatCurrency(items.filter((item) => item.tipo === 'receber').reduce((acc, item) => acc + item.valor, 0)) }, { label: 'Saldo projetado', valor: formatCurrency(saldo), destaque: true }] }] };
}

export function getDocumentosWorkspace(obraId: string): ObraWorkspaceTabData<ObraDocumentoItem> {
  const items = fallback(documentosPorObra, obraId);
  return { items, resumoCards: [{ id: 'documentos-alerta', titulo: 'Governança documental', descricao: 'Documentos críticos da obra para conformidade, segurança e liberação operacional.', itens: [{ label: 'Vigentes', valor: String(items.filter((item) => item.status === 'vigente').length) }, { label: 'A vencer', valor: String(items.filter((item) => item.status === 'a_vencer').length), destaque: true }, { label: 'Em análise', valor: String(items.filter((item) => item.status === 'em_analise').length) }] }] };
}

export function getContratosWorkspace(obraId: string): ObraWorkspaceTabData<ObraContratoItem> {
  const items = fallback(contratosPorObra, obraId);
  const valorTotal = items.reduce((acc, item) => acc + item.valorContrato + item.valorAditivos, 0);
  return {
    items,
    resumoCards: [
      {
        id: 'contratos-resumo',
        titulo: 'Contratos da obra',
        descricao: 'Contratos ativos com clientes, fornecedores e subcontratados que impactam prazo e custo.',
        itens: [
          { label: 'Ativos', valor: String(items.filter((item) => item.status === 'ativo').length), destaque: true },
          { label: 'Em negociação', valor: String(items.filter((item) => item.status === 'em_negociacao').length) },
          { label: 'Valor contratado', valor: formatCurrency(valorTotal) },
        ],
      },
    ],
  };
}

export function getEstoqueWorkspace(obraId: string): ObraWorkspaceTabData<ObraEstoqueItem> {
  const items = fallback(estoquePorObra, obraId);
  const criticos = items.filter((item) => item.status === 'critico' || item.status === 'esgotado').length;
  return {
    items,
    resumoCards: [
      {
        id: 'estoque-saldo',
        titulo: 'Estoque da obra',
        descricao: 'Saldos e consumo de materiais vinculados à execução e ao almoxarifado da obra.',
        itens: [
          { label: 'Itens disponíveis', valor: String(items.filter((item) => item.status === 'disponivel').length) },
          { label: 'Críticos / esgotados', valor: String(criticos), destaque: criticos > 0 },
          { label: 'Insumos monitorados', valor: String(items.length) },
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

export function getEstoqueWorkspace(obraId: string): ObraWorkspaceTabData<ObraEstoqueItem> {
  const items = fallback(estoquePorObra, obraId);
  return {
    items,
    resumoCards: [
      {
        id: 'estoque-resumo',
        titulo: 'Estoque da obra',
        descricao: 'Estrutura inicial para consumo, saldo e materiais críticos da obra.',
        itens: [
          { label: 'Itens monitorados', valor: String(items.length) },
          { label: 'Itens críticos', valor: String(items.filter((item) => item.status === 'critico').length), destaque: true },
          { label: 'Valor em estoque', valor: formatCurrency(items.reduce((acc, item) => acc + item.custoTotal, 0)) },
        ],
      },
    ],
  };
}

export function getMedicoesWorkspace(obraId: string): ObraWorkspaceTabData<ObraMedicaoItem> {
  const items = fallback(medicoesPorObra, obraId);
  return {
    items,
    resumoCards: [
      {
        id: 'medicoes-resumo',
        titulo: 'Medições da obra',
        descricao: 'Bloco inicial para evolução contratual, aprovação e faturamento por competência.',
        itens: [
          { label: 'Medições', valor: String(items.length) },
          { label: 'Em aprovação', valor: String(items.filter((item) => item.status === 'em_aprovacao').length), destaque: true },
          { label: 'Valor monitorado', valor: formatCurrency(items.reduce((acc, item) => acc + item.valor, 0)) },
        ],
      },
    ],
  };
}

export function getMedicoesWorkspace(obraId: string): ObraWorkspaceTabData<ObraMedicaoItem> {
  const items = fallback(medicoesPorObra, obraId);
  const valorFaturado = items.filter((item) => item.status === 'faturada').reduce((acc, item) => acc + item.valorMedido, 0);
  return {
    items,
    resumoCards: [
      {
        id: 'medicoes-resumo',
        titulo: 'Medições e faturamento',
        descricao: 'Acompanhamento da produção executada, aprovação e reflexo no faturamento da obra.',
        itens: [
          { label: 'Aprovadas', valor: String(items.filter((item) => item.status === 'aprovada').length) },
          { label: 'Em apuração', valor: String(items.filter((item) => item.status === 'em_apuracao').length), destaque: true },
          { label: 'Valor faturado', valor: formatCurrency(valorFaturado) },
        ],
      },
    ],
  };
}

export function getRiscosWorkspace(obraId: string): ObraWorkspaceTabData<ObraRiscoItem> {
  const items = fallback(riscosPorObra, obraId);
  const altos = items.filter((item) => item.impacto === 'alto' && item.status !== 'mitigado').length;
  return {
    items,
    resumoCards: [
      {
        id: 'riscos-matriz',
        titulo: 'Matriz de riscos',
        descricao: 'Riscos identificados com priorização por impacto e status de resposta operacional.',
        itens: [
          { label: 'Identificados', valor: String(items.length) },
          { label: 'Alto impacto (abertos)', valor: String(altos), destaque: altos > 0 },
          { label: 'Em mitigação', valor: String(items.filter((item) => item.status === 'em_mitigacao').length) },
        ],
      },
    ],
  };
}

export function getDocumentosWorkspace(obraId: string): ObraWorkspaceTabData<ObraDocumentoItem> {
  const items = fallback(documentosPorObra, obraId);
  return { items, resumoCards: [{ id: 'documentos-alerta', titulo: 'Governança documental', descricao: 'Documentos críticos da obra para conformidade, segurança e liberação operacional.', itens: [{ label: 'Vigentes', valor: String(items.filter((item) => item.status === 'vigente').length) }, { label: 'A vencer', valor: String(items.filter((item) => item.status === 'a_vencer').length), destaque: true }, { label: 'Em análise', valor: String(items.filter((item) => item.status === 'em_analise').length) }] }] };
}
