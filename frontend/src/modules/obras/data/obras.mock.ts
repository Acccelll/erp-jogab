/**
 * Dados mock do módulo Obras.
 * Substituídos por chamadas API reais em fases futuras.
 */
import type { Obra, ObraListItem, ObrasKpis, ObraVisaoGeralKpis, ObraResumoBloco } from '../types';

export const mockObras: Obra[] = [
  {
    id: 'obra-1',
    codigo: 'OBR-001',
    nome: 'Edifício Aurora',
    descricao: 'Construção de edifício residencial de alto padrão com 20 pavimentos.',
    status: 'em_andamento',
    tipo: 'residencial',
    clienteNome: 'Construtora Alpha Ltda',
    clienteId: 'cli-1',
    responsavelNome: 'Carlos Oliveira',
    responsavelId: 'resp-1',
    filialId: 'fil-1',
    filialNome: 'Matriz — São Paulo',
    empresaId: 'emp-1',
    endereco: 'Av. Paulista, 1000',
    cidade: 'São Paulo',
    uf: 'SP',
    dataInicio: '2025-03-01',
    dataPrevisaoFim: '2027-06-30',
    dataFimReal: null,
    percentualConcluido: 42,
    orcamentoPrevisto: 25000000,
    custoRealizado: 8750000,
    custoComprometido: 3200000,
    totalFuncionarios: 85,
    totalContratos: 12,
    createdAt: '2025-02-15T10:00:00Z',
    updatedAt: '2026-03-18T14:30:00Z',
  },
  {
    id: 'obra-2',
    codigo: 'OBR-002',
    nome: 'Residencial Parque',
    descricao: 'Loteamento residencial com 150 lotes e infraestrutura completa.',
    status: 'em_andamento',
    tipo: 'residencial',
    clienteNome: 'Incorporadora Beta S.A.',
    clienteId: 'cli-2',
    responsavelNome: 'Ana Souza',
    responsavelId: 'resp-2',
    filialId: 'fil-2',
    filialNome: 'Filial — Rio de Janeiro',
    empresaId: 'emp-1',
    endereco: 'Rod. BR-101, km 45',
    cidade: 'Rio de Janeiro',
    uf: 'RJ',
    dataInicio: '2025-06-01',
    dataPrevisaoFim: '2027-12-31',
    dataFimReal: null,
    percentualConcluido: 18,
    orcamentoPrevisto: 12000000,
    custoRealizado: 1800000,
    custoComprometido: 950000,
    totalFuncionarios: 42,
    totalContratos: 6,
    createdAt: '2025-05-20T08:00:00Z',
    updatedAt: '2026-03-15T11:00:00Z',
  },
  {
    id: 'obra-3',
    codigo: 'OBR-003',
    nome: 'Torre Empresarial',
    descricao: 'Edifício comercial com 15 andares, salas comerciais e estacionamento.',
    status: 'planejamento',
    tipo: 'comercial',
    clienteNome: 'Grupo Gamma Empreendimentos',
    clienteId: 'cli-3',
    responsavelNome: 'Roberto Lima',
    responsavelId: 'resp-3',
    filialId: 'fil-1',
    filialNome: 'Matriz — São Paulo',
    empresaId: 'emp-1',
    endereco: 'R. Augusta, 2500',
    cidade: 'São Paulo',
    uf: 'SP',
    dataInicio: '2026-07-01',
    dataPrevisaoFim: '2028-12-31',
    dataFimReal: null,
    percentualConcluido: 0,
    orcamentoPrevisto: 35000000,
    custoRealizado: 0,
    custoComprometido: 1500000,
    totalFuncionarios: 0,
    totalContratos: 2,
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-03-10T16:00:00Z',
  },
  {
    id: 'obra-4',
    codigo: 'OBR-004',
    nome: 'Ponte BR-101',
    descricao: 'Construção de ponte rodoviária sobre o Rio Tietê, extensão de 450m.',
    status: 'em_andamento',
    tipo: 'infraestrutura',
    clienteNome: 'DER-SP',
    clienteId: 'cli-4',
    responsavelNome: 'Marcos Santos',
    responsavelId: 'resp-4',
    filialId: 'fil-3',
    filialNome: 'Filial — Belo Horizonte',
    empresaId: 'emp-1',
    endereco: 'BR-101, km 320',
    cidade: 'Campinas',
    uf: 'SP',
    dataInicio: '2024-08-01',
    dataPrevisaoFim: '2026-08-31',
    dataFimReal: null,
    percentualConcluido: 78,
    orcamentoPrevisto: 18000000,
    custoRealizado: 12600000,
    custoComprometido: 2100000,
    totalFuncionarios: 120,
    totalContratos: 8,
    createdAt: '2024-07-01T10:00:00Z',
    updatedAt: '2026-03-19T09:00:00Z',
  },
  {
    id: 'obra-5',
    codigo: 'OBR-005',
    nome: 'Reforma Sede Central',
    descricao: 'Reforma e modernização da sede administrativa da JOGAB.',
    status: 'concluida',
    tipo: 'reforma',
    clienteNome: 'JOGAB Engenharia Ltda',
    clienteId: 'cli-5',
    responsavelNome: 'Patricia Fernandes',
    responsavelId: 'resp-5',
    filialId: 'fil-1',
    filialNome: 'Matriz — São Paulo',
    empresaId: 'emp-1',
    endereco: 'R. da Consolação, 800',
    cidade: 'São Paulo',
    uf: 'SP',
    dataInicio: '2025-01-15',
    dataPrevisaoFim: '2025-09-30',
    dataFimReal: '2025-10-15',
    percentualConcluido: 100,
    orcamentoPrevisto: 2500000,
    custoRealizado: 2680000,
    custoComprometido: 0,
    totalFuncionarios: 0,
    totalContratos: 4,
    createdAt: '2024-12-20T10:00:00Z',
    updatedAt: '2025-10-15T17:00:00Z',
  },
  {
    id: 'obra-6',
    codigo: 'OBR-006',
    nome: 'Galpão Industrial Sigma',
    descricao: 'Construção de galpão industrial com 8.000m² de área coberta.',
    status: 'paralisada',
    tipo: 'industrial',
    clienteNome: 'Indústria Sigma',
    clienteId: 'cli-6',
    responsavelNome: 'Carlos Oliveira',
    responsavelId: 'resp-1',
    filialId: 'fil-3',
    filialNome: 'Filial — Belo Horizonte',
    empresaId: 'emp-1',
    endereco: 'Distrito Industrial, Lote 15',
    cidade: 'Belo Horizonte',
    uf: 'MG',
    dataInicio: '2025-09-01',
    dataPrevisaoFim: '2026-12-31',
    dataFimReal: null,
    percentualConcluido: 35,
    orcamentoPrevisto: 9000000,
    custoRealizado: 2700000,
    custoComprometido: 800000,
    totalFuncionarios: 15,
    totalContratos: 5,
    createdAt: '2025-08-10T10:00:00Z',
    updatedAt: '2026-02-28T12:00:00Z',
  },
];

/** Converte Obra completa para ObraListItem */
export function toObraListItem(obra: Obra): ObraListItem {
  return {
    id: obra.id,
    codigo: obra.codigo,
    nome: obra.nome,
    status: obra.status,
    tipo: obra.tipo,
    clienteNome: obra.clienteNome,
    responsavelNome: obra.responsavelNome,
    filialNome: obra.filialNome,
    cidade: obra.cidade,
    uf: obra.uf,
    dataInicio: obra.dataInicio,
    dataPrevisaoFim: obra.dataPrevisaoFim,
    percentualConcluido: obra.percentualConcluido,
    orcamentoPrevisto: obra.orcamentoPrevisto,
    custoRealizado: obra.custoRealizado,
    totalFuncionarios: obra.totalFuncionarios,
  };
}

/** Calcula KPIs da listagem de obras */
export function calcularObrasKpis(obras: Obra[]): ObrasKpis {
  return {
    totalObras: obras.length,
    obrasAtivas: obras.filter((o) => o.status === 'em_andamento').length,
    obrasConcluidas: obras.filter((o) => o.status === 'concluida').length,
    obrasParalisadas: obras.filter((o) => o.status === 'paralisada').length,
    orcamentoTotal: obras.reduce((acc, o) => acc + o.orcamentoPrevisto, 0),
    custoRealizadoTotal: obras.reduce((acc, o) => acc + o.custoRealizado, 0),
  };
}

/** Calcula KPIs da visão geral de uma obra */
export function calcularObraVisaoGeralKpis(obra: Obra): ObraVisaoGeralKpis {
  const saldo = obra.orcamentoPrevisto - obra.custoRealizado - obra.custoComprometido;
  const hoje = new Date();
  const fim = new Date(obra.dataPrevisaoFim);
  const diasRestantes = Math.max(0, Math.ceil((fim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)));

  return {
    orcamentoPrevisto: obra.orcamentoPrevisto,
    custoRealizado: obra.custoRealizado,
    custoComprometido: obra.custoComprometido,
    saldoDisponivel: saldo,
    percentualConcluido: obra.percentualConcluido,
    diasRestantes,
    totalFuncionarios: obra.totalFuncionarios,
    totalContratos: obra.totalContratos,
  };
}

/** Gera blocos de resumo da visão geral (dados simulados) */
export function gerarResumoBlocos(obra: Obra): ObraResumoBloco[] {
  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return [
    {
      titulo: 'Financeiro',
      itens: [
        { label: 'Orçamento Previsto', valor: fmt(obra.orcamentoPrevisto) },
        { label: 'Custo Realizado', valor: fmt(obra.custoRealizado), destaque: true },
        { label: 'Comprometido', valor: fmt(obra.custoComprometido) },
        { label: 'Saldo', valor: fmt(obra.orcamentoPrevisto - obra.custoRealizado - obra.custoComprometido) },
      ],
    },
    {
      titulo: 'Equipe',
      itens: [
        { label: 'Funcionários alocados', valor: String(obra.totalFuncionarios), destaque: true },
        { label: 'Encarregados', valor: String(Math.ceil(obra.totalFuncionarios * 0.1)) },
        { label: 'Engenheiros', valor: String(Math.ceil(obra.totalFuncionarios * 0.05)) },
      ],
    },
    {
      titulo: 'Compras',
      itens: [
        { label: 'Solicitações abertas', valor: String(Math.ceil(Math.random() * 8 + 2)) },
        { label: 'Pedidos em andamento', valor: String(Math.ceil(Math.random() * 5 + 1)) },
        { label: 'Pedidos concluídos', valor: String(Math.ceil(Math.random() * 15 + 5)) },
      ],
    },
    {
      titulo: 'Medições',
      itens: [
        { label: 'Medições realizadas', valor: String(Math.ceil(obra.percentualConcluido / 10)) },
        { label: 'Próxima medição', valor: 'Abril/2026' },
        { label: 'Valor medido', valor: fmt(obra.custoRealizado * 0.85) },
      ],
    },
    {
      titulo: 'Documentos',
      itens: [
        { label: 'Documentos ativos', valor: String(Math.ceil(Math.random() * 30 + 10)) },
        { label: 'Vencendo em 30 dias', valor: String(Math.ceil(Math.random() * 3)), destaque: true },
        { label: 'Pendentes de aprovação', valor: String(Math.ceil(Math.random() * 5)) },
      ],
    },
    {
      titulo: 'RH / FOPAG',
      itens: [
        { label: 'Custo folha previsto', valor: fmt(obra.totalFuncionarios * 4500) },
        { label: 'Horas extras mês', valor: `${Math.ceil(Math.random() * 200 + 50)}h` },
        { label: 'Competência ativa', valor: '03/2026' },
      ],
    },
  ];
}
