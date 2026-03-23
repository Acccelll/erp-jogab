import type { AlocacaoCreatePayload, AlocacaoMutationResponse, AlocacaoResumo, AlocacaoUpdatePayload, CentroCustoResumo } from '@/shared/types';

export const mockCentrosCusto: CentroCustoResumo[] = [
  { id: 'cc-1', codigo: 'CC-AUR-ENG', nome: 'Obra Aurora — Engenharia', obraId: 'obra-1', obraNome: 'Edifício Aurora', filialId: 'fil-1' },
  { id: 'cc-2', codigo: 'CC-AUR-SEG', nome: 'Obra Aurora — Segurança', obraId: 'obra-1', obraNome: 'Edifício Aurora', filialId: 'fil-1' },
  { id: 'cc-3', codigo: 'CC-PAR-PROD', nome: 'Obra Parque — Produção', obraId: 'obra-2', obraNome: 'Residencial Parque', filialId: 'fil-2' },
  { id: 'cc-4', codigo: 'CC-PON-PROD', nome: 'Obra Ponte — Produção', obraId: 'obra-4', obraNome: 'Ponte BR-101', filialId: 'fil-3' },
  { id: 'cc-5', codigo: 'CC-TOR-PROJ', nome: 'Obra Torre — Projetos', obraId: 'obra-3', obraNome: 'Torre Empresarial', filialId: 'fil-1' },
  { id: 'cc-6', codigo: 'CC-PAR-ENC', nome: 'Obra Parque — Encarregados', obraId: 'obra-2', obraNome: 'Residencial Parque', filialId: 'fil-2' },
  { id: 'cc-7', codigo: 'CC-AUR-AUX', nome: 'Obra Aurora — Auxiliares', obraId: 'obra-1', obraNome: 'Edifício Aurora', filialId: 'fil-1' },
  { id: 'cc-8', codigo: 'CC-AUR-ALM', nome: 'Obra Aurora — Almoxarifado', obraId: 'obra-1', obraNome: 'Edifício Aurora', filialId: 'fil-1' },
  { id: 'cc-9', codigo: 'CC-PON-OPER', nome: 'Obra Ponte — Equipamentos', obraId: 'obra-4', obraNome: 'Ponte BR-101', filialId: 'fil-3' },
]

export const mockAlocacoes: AlocacaoResumo[] = [
  { id: 'alo-1', funcionarioId: 'func-1', funcionarioNome: 'João Silva', obraId: 'obra-1', obraNome: 'Edifício Aurora', centroCustoId: 'cc-1', centroCustoNome: 'Obra Aurora — Engenharia', funcao: 'Engenheiro de Obra', equipe: 'Engenharia', jornada: '44h semanais', percentual: 100, departamento: 'Engenharia', periodoInicio: '2023-03-15', status: 'ativa' },
  { id: 'alo-2', funcionarioId: 'func-1', funcionarioNome: 'João Silva', obraId: 'obra-3', obraNome: 'Torre Empresarial', centroCustoId: 'cc-5', centroCustoNome: 'Obra Torre — Projetos', funcao: 'Suporte de compatibilização', equipe: 'Projetos', jornada: '20h semanais', percentual: 20, departamento: 'Engenharia', periodoInicio: '2025-08-01', periodoFim: '2025-10-15', status: 'encerrada' },
  { id: 'alo-3', funcionarioId: 'func-2', funcionarioNome: 'Maria Oliveira', obraId: 'obra-1', obraNome: 'Edifício Aurora', centroCustoId: 'cc-2', centroCustoNome: 'Obra Aurora — Segurança', funcao: 'Técnica de Segurança do Trabalho', equipe: 'Segurança', jornada: '44h semanais', percentual: 100, departamento: 'Segurança', periodoInicio: '2022-06-01', status: 'ativa' },
  { id: 'alo-4', funcionarioId: 'func-3', funcionarioNome: 'Pedro Santos', obraId: 'obra-2', obraNome: 'Residencial Parque', centroCustoId: 'cc-3', centroCustoNome: 'Obra Parque — Produção', funcao: 'Mestre de Obras', equipe: 'Produção', jornada: '44h semanais', percentual: 100, departamento: 'Produção', periodoInicio: '2020-01-10', status: 'ativa' },
  { id: 'alo-5', funcionarioId: 'func-3', funcionarioNome: 'Pedro Santos', obraId: 'obra-4', obraNome: 'Ponte BR-101', centroCustoId: 'cc-4', centroCustoNome: 'Obra Ponte — Produção', funcao: 'Apoio em mobilização', equipe: 'Mobilização', jornada: '16h semanais', percentual: 30, departamento: 'Produção', periodoInicio: '2026-04-01', status: 'planejada' },
  { id: 'alo-6', funcionarioId: 'func-5', funcionarioNome: 'Carlos Mendes', obraId: 'obra-4', obraNome: 'Ponte BR-101', centroCustoId: 'cc-4', centroCustoNome: 'Obra Ponte — Produção', funcao: 'Pedreiro Oficial', equipe: 'Estrutura', jornada: '44h semanais', percentual: 100, departamento: 'Produção', periodoInicio: '2019-04-15', status: 'ativa' },
  { id: 'alo-7', funcionarioId: 'func-6', funcionarioNome: 'Luciana Almeida', obraId: 'obra-3', obraNome: 'Torre Empresarial', centroCustoId: 'cc-5', centroCustoNome: 'Obra Torre — Projetos', funcao: 'Arquiteta Projetista', equipe: 'Projetos', jornada: '40h semanais', percentual: 100, departamento: 'Projetos', periodoInicio: '2024-01-10', status: 'ativa' },
  { id: 'alo-8', funcionarioId: 'func-8', funcionarioNome: 'Fernanda Costa', obraId: 'obra-2', obraNome: 'Residencial Parque', centroCustoId: 'cc-6', centroCustoNome: 'Obra Parque — Encarregados', funcao: 'Encarregada de Obras', equipe: 'Campo', jornada: '44h semanais', percentual: 100, departamento: 'Produção', periodoInicio: '2021-03-01', status: 'ativa' },
  { id: 'alo-9', funcionarioId: 'func-9', funcionarioNome: 'Ricardo Barbosa', obraId: 'obra-1', obraNome: 'Edifício Aurora', centroCustoId: 'cc-7', centroCustoNome: 'Obra Aurora — Auxiliares', funcao: 'Auxiliar Geral', equipe: 'Campo', jornada: '44h semanais', percentual: 100, departamento: 'Produção', periodoInicio: '2025-11-01', status: 'ativa' },
  { id: 'alo-10', funcionarioId: 'func-10', funcionarioNome: 'Patrícia Rocha', obraId: 'obra-1', obraNome: 'Edifício Aurora', centroCustoId: 'cc-8', centroCustoNome: 'Obra Aurora — Almoxarifado', funcao: 'Almoxarife de Obra', equipe: 'Suprimentos', jornada: '44h semanais', percentual: 100, departamento: 'Estoque', periodoInicio: '2026-04-01', status: 'planejada' },
  { id: 'alo-11', funcionarioId: 'func-11', funcionarioNome: 'Luan Ferreira', obraId: 'obra-4', obraNome: 'Ponte BR-101', centroCustoId: 'cc-9', centroCustoNome: 'Obra Ponte — Equipamentos', funcao: 'Operador de Equipamentos', equipe: 'Infraestrutura', jornada: '12x36', percentual: 100, departamento: 'Produção', periodoInicio: '2025-07-10', periodoFim: '2026-04-30', status: 'encerrada' },
]

export function getAlocacoesByObraId(obraId: string) {
  return mockAlocacoes.filter((alocacao) => alocacao.obraId === obraId);
}

export function getAlocacoesByFuncionarioId(funcionarioId: string) {
  return mockAlocacoes.filter((alocacao) => alocacao.funcionarioId === funcionarioId);
}

/** Retorna a alocação ativa do funcionário, ou null se não houver. */
export function getAlocacaoAtivaByFuncionarioId(funcionarioId: string) {
  return mockAlocacoes.find((alocacao) => alocacao.funcionarioId === funcionarioId && alocacao.status === 'ativa') ?? null;
}

export function getCentroCustoById(centroCustoId: string | null | undefined) {
  return centroCustoId ? mockCentrosCusto.find((centro) => centro.id === centroCustoId) ?? null : null;
}

/** Retorna todos os centros de custo vinculados a uma obra. Retorna [] se nenhum encontrado. */
export function getCentrosCustoByObraId(obraId: string) {
  return mockCentrosCusto.filter((centro) => centro.obraId === obraId);
}

/** Retorna alocação por ID, ou null se não encontrada. */
export function getAlocacaoById(id: string): AlocacaoResumo | null {
  return mockAlocacoes.find((a) => a.id === id) ?? null;
}

/** Retorna todas as alocações ativas vinculadas a uma obra. */
export function getAlocacoesAtivasByObraId(obraId: string): AlocacaoResumo[] {
  return mockAlocacoes.filter((a) => a.obraId === obraId && a.status === 'ativa');
}

/** Retorna todas as alocações ativas do funcionário. */
export function getAlocacoesAtivasByFuncionarioId(funcionarioId: string): AlocacaoResumo[] {
  return mockAlocacoes.filter((a) => a.funcionarioId === funcionarioId && a.status === 'ativa');
}

let _nextAloId = 100;

/** Cria uma nova alocação no mock e retorna a resposta de mutação. */
export function createAlocacao(payload: AlocacaoCreatePayload & { funcionarioNome: string; obraNome: string; centroCustoNome: string }): AlocacaoMutationResponse {
  const alocacao: AlocacaoResumo = {
    id: `alo-${++_nextAloId}`,
    funcionarioId: payload.funcionarioId,
    funcionarioNome: payload.funcionarioNome,
    obraId: payload.obraId,
    obraNome: payload.obraNome,
    centroCustoId: payload.centroCustoId,
    centroCustoNome: payload.centroCustoNome,
    funcao: payload.funcao,
    equipe: payload.equipe,
    jornada: payload.jornada,
    percentual: payload.percentual,
    departamento: payload.departamento,
    periodoInicio: payload.periodoInicio,
    periodoFim: payload.periodoFim,
    status: payload.status ?? 'ativa',
  };
  mockAlocacoes.push(alocacao);
  return { message: 'Alocação criada com sucesso.', alocacao };
}

/** Atualiza uma alocação existente no mock. */
export function updateAlocacao(payload: AlocacaoUpdatePayload & { funcionarioNome: string; obraNome: string; centroCustoNome: string }): AlocacaoMutationResponse {
  const index = mockAlocacoes.findIndex((a) => a.id === payload.id);
  if (index === -1) throw new Error('Alocação não encontrada para atualização.');
  const alocacao: AlocacaoResumo = {
    ...mockAlocacoes[index],
    funcionarioId: payload.funcionarioId,
    funcionarioNome: payload.funcionarioNome,
    obraId: payload.obraId,
    obraNome: payload.obraNome,
    centroCustoId: payload.centroCustoId,
    centroCustoNome: payload.centroCustoNome,
    funcao: payload.funcao,
    equipe: payload.equipe,
    jornada: payload.jornada,
    percentual: payload.percentual,
    departamento: payload.departamento,
    periodoInicio: payload.periodoInicio,
    periodoFim: payload.periodoFim,
    status: payload.status ?? mockAlocacoes[index].status,
  };
  mockAlocacoes[index] = alocacao;
  return { message: 'Alocação atualizada com sucesso.', alocacao };
}

/** Encerra uma alocação pelo ID. */
export function encerrarAlocacao(id: string): AlocacaoMutationResponse {
  const index = mockAlocacoes.findIndex((a) => a.id === id);
  if (index === -1) throw new Error('Alocação não encontrada para encerramento.');
  mockAlocacoes[index] = { ...mockAlocacoes[index], status: 'encerrada' };
  return { message: 'Alocação encerrada com sucesso.', alocacao: mockAlocacoes[index] };
}

/** Remove alocações ativas do funcionário (limpa vínculo atual). */
export function clearFuncionarioAlocacaoAtiva(funcionarioId: string): void {
  for (let i = 0; i < mockAlocacoes.length; i++) {
    if (mockAlocacoes[i].funcionarioId === funcionarioId && mockAlocacoes[i].status === 'ativa') {
      mockAlocacoes[i] = { ...mockAlocacoes[i], status: 'encerrada' };
    }
  }
}

/** Cria ou atualiza a alocação ativa de um funcionário. */
export function upsertFuncionarioAlocacaoAtiva(payload: {
  funcionarioId: string;
  funcionarioNome: string;
  obraId: string;
  obraNome: string;
  centroCustoId: string;
  centroCustoNome: string;
  funcao: string;
  departamento: string;
}): void {
  const existing = mockAlocacoes.find((a) => a.funcionarioId === payload.funcionarioId && a.status === 'ativa');
  if (existing) {
    Object.assign(existing, {
      obraId: payload.obraId,
      obraNome: payload.obraNome,
      centroCustoId: payload.centroCustoId,
      centroCustoNome: payload.centroCustoNome,
      funcao: payload.funcao,
      departamento: payload.departamento,
    });
  } else {
    mockAlocacoes.push({
      id: `alo-${++_nextAloId}`,
      funcionarioId: payload.funcionarioId,
      funcionarioNome: payload.funcionarioNome,
      obraId: payload.obraId,
      obraNome: payload.obraNome,
      centroCustoId: payload.centroCustoId,
      centroCustoNome: payload.centroCustoNome,
      funcao: payload.funcao,
      equipe: 'Campo',
      jornada: '44h semanais',
      percentual: 100,
      departamento: payload.departamento,
      periodoInicio: new Date().toISOString().slice(0, 10),
      status: 'ativa',
    });
  }
}
