import { getFuncionariosByObra, mapFuncionarioStatusToEquipeStatus } from '@/modules/rh/data/funcionarios.mock';
import type { ObraEquipeItem } from '../types';
import {
  getComprasWorkspace,
  getCronogramaWorkspace,
  getDocumentosWorkspace,
  getFinanceiroWorkspace,
} from '../data/obra-workspace.mock';

function delay(ms = 180): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function inferEquipe(departamento: string): string {
  const normalized = departamento.toLowerCase();
  if (normalized.includes('engenharia') || normalized.includes('projetos')) return 'Planejamento';
  if (normalized.includes('segurança')) return 'Segurança';
  if (normalized.includes('estoque')) return 'Apoio';
  if (normalized.includes('produção')) return 'Campo';
  return 'Operação';
}

function inferJornada(tipoContrato: string): string {
  if (tipoContrato === 'temporario') return '44h semanais · temporário';
  if (tipoContrato === 'pj') return 'Contrato PJ';
  return '44h semanais';
}

function buildEquipeItems(obraId: string): ObraEquipeItem[] {
  return getFuncionariosByObra(obraId).map((funcionario) => ({
    id: `eq-${funcionario.id}`,
    funcionarioId: funcionario.id,
    matricula: funcionario.matricula,
    nome: funcionario.nome,
    cargo: funcionario.cargo,
    funcao: funcionario.funcao,
    equipe: inferEquipe(funcionario.departamento),
    status: mapFuncionarioStatusToEquipeStatus(funcionario.status),
    jornada: inferJornada(funcionario.tipoContrato),
    tipoContrato: funcionario.tipoContrato.toUpperCase(),
    centroCustoId: funcionario.centroCustoId,
    centroCustoNome: funcionario.centroCustoNome,
    obraId,
  }));
}

export async function fetchObraCronograma(obraId: string) {
  await delay();
  return getCronogramaWorkspace(obraId);
}

export async function fetchObraEquipe(obraId: string) {
  await delay();
  const items = buildEquipeItems(obraId);

  return {
    items,
    resumoCards: [
      {
        id: 'equipe-alocacao',
        titulo: 'Alocação de equipe',
        descricao: 'Base compartilhada com RH para refletir vínculo funcionário, obra e centro de custo.',
        itens: [
          { label: 'Alocados', valor: String(items.filter((item) => item.status === 'alocado').length), destaque: true },
          { label: 'Férias', valor: String(items.filter((item) => item.status === 'ferias').length) },
          { label: 'Centros de custo', valor: String(new Set(items.map((item) => item.centroCustoId).filter(Boolean)).size) },
        ],
      },
    ],
  };
}

export async function fetchObraCompras(obraId: string) {
  await delay();
  return getComprasWorkspace(obraId);
}

export async function fetchObraFinanceiro(obraId: string) {
  await delay();
  return getFinanceiroWorkspace(obraId);
}

export async function fetchObraDocumentos(obraId: string) {
  await delay();
  return getDocumentosWorkspace(obraId);
}
