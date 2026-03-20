/**
 * Service do módulo RH.
 *
 * Atualmente usa dados mock. Quando a API estiver disponível,
 * basta trocar as implementações para chamadas reais via api.ts.
 */
import type {
  Funcionario,
  FuncionarioListItem,
  FuncionariosKpis,
  FuncionarioResumoBloco,
} from '../types';
import type { FuncionarioFiltersData } from '../types';
import {
  mockFuncionarios,
  toFuncionarioListItem,
  calcularFuncionariosKpis,
  gerarFuncionarioResumoBlocos,
} from '../data/funcionarios.mock';

/** Simula latência de rede */
function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Lista funcionários com filtros */
export async function fetchFuncionarios(filters?: FuncionarioFiltersData): Promise<{
  data: FuncionarioListItem[];
  kpis: FuncionariosKpis;
}> {
  await delay();

  let resultado = [...mockFuncionarios];

  if (filters?.search) {
    const term = filters.search.toLowerCase();
    resultado = resultado.filter(
      (f) =>
        f.nome.toLowerCase().includes(term) ||
        f.matricula.toLowerCase().includes(term) ||
        f.cpf.includes(term) ||
        f.cargo.toLowerCase().includes(term),
    );
  }

  if (filters?.status) {
    resultado = resultado.filter((f) => f.status === filters.status);
  }

  if (filters?.tipoContrato) {
    resultado = resultado.filter((f) => f.tipoContrato === filters.tipoContrato);
  }

  if (filters?.filialId) {
    resultado = resultado.filter((f) => f.filialId === filters.filialId);
  }

  if (filters?.obraId) {
    resultado = resultado.filter((f) => f.obraAlocadoId === filters.obraId);
  }

  if (filters?.departamento) {
    resultado = resultado.filter((f) => f.departamento === filters.departamento);
  }

  const kpis = calcularFuncionariosKpis(resultado);
  const data = resultado.map(toFuncionarioListItem);

  return { data, kpis };
}

/** Busca um funcionário pelo ID */
export async function fetchFuncionarioById(funcId: string): Promise<Funcionario | null> {
  await delay(200);
  return mockFuncionarios.find((f) => f.id === funcId) ?? null;
}

/** Blocos de resumo do detalhe do funcionário */
export async function fetchFuncionarioResumoBlocos(funcId: string): Promise<FuncionarioResumoBloco[]> {
  await delay(200);
  const func = mockFuncionarios.find((f) => f.id === funcId);
  if (!func) return [];
  return gerarFuncionarioResumoBlocos(func);
}
