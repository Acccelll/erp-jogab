/**
 * Dados mock do módulo RH.
 * Substituídos por chamadas API reais em fases futuras.
 */
import { getAlocacoesByFuncionarioId } from '@/shared/lib/erpRelations';
import type { Funcionario, FuncionarioListItem, FuncionariosKpis, FuncionarioResumoBloco } from '../types';

export const mockFuncionarios: Funcionario[] = [
  { id: 'func-1', matricula: 'MAT-001', nome: 'João Silva', cpf: '123.456.789-00', status: 'ativo', tipoContrato: 'clt', cargo: 'Engenheiro Civil', funcao: 'Engenheiro de Obra', departamento: 'Engenharia', filialId: 'fil-1', filialNome: 'Matriz — São Paulo', empresaId: 'emp-1', obraAlocadoId: 'obra-1', obraAlocadoNome: 'Edifício Aurora', centroCustoId: 'cc-1', centroCustoNome: 'Obra Aurora — Engenharia', dataAdmissao: '2023-03-15', dataDesligamento: null, salarioBase: 12500, email: 'joao.silva@jogab.com.br', telefone: '(11) 99999-0001', cidade: 'São Paulo', uf: 'SP', gestorNome: 'Carlos Oliveira', gestorId: 'resp-1', createdAt: '2023-03-10T10:00:00Z', updatedAt: '2026-03-18T14:30:00Z' },
  { id: 'func-2', matricula: 'MAT-002', nome: 'Maria Oliveira', cpf: '987.654.321-00', status: 'ativo', tipoContrato: 'clt', cargo: 'Técnica de Segurança', funcao: 'Técnica de Segurança do Trabalho', departamento: 'Segurança', filialId: 'fil-1', filialNome: 'Matriz — São Paulo', empresaId: 'emp-1', obraAlocadoId: 'obra-1', obraAlocadoNome: 'Edifício Aurora', centroCustoId: 'cc-2', centroCustoNome: 'Obra Aurora — Segurança', dataAdmissao: '2022-06-01', dataDesligamento: null, salarioBase: 6800, email: 'maria.oliveira@jogab.com.br', telefone: '(11) 99999-0002', cidade: 'São Paulo', uf: 'SP', gestorNome: 'Carlos Oliveira', gestorId: 'resp-1', createdAt: '2022-05-20T08:00:00Z', updatedAt: '2026-03-15T11:00:00Z' },
  { id: 'func-3', matricula: 'MAT-003', nome: 'Pedro Santos', cpf: '456.789.123-00', status: 'ativo', tipoContrato: 'clt', cargo: 'Mestre de Obras', funcao: 'Mestre de Obras', departamento: 'Produção', filialId: 'fil-2', filialNome: 'Filial — Rio de Janeiro', empresaId: 'emp-1', obraAlocadoId: 'obra-2', obraAlocadoNome: 'Residencial Parque', centroCustoId: 'cc-3', centroCustoNome: 'Obra Parque — Produção', dataAdmissao: '2020-01-10', dataDesligamento: null, salarioBase: 8500, email: 'pedro.santos@jogab.com.br', telefone: '(21) 98888-0003', cidade: 'Rio de Janeiro', uf: 'RJ', gestorNome: 'Ana Souza', gestorId: 'resp-2', createdAt: '2019-12-20T10:00:00Z', updatedAt: '2026-03-10T16:00:00Z' },
  { id: 'func-4', matricula: 'MAT-004', nome: 'Ana Paula Ferreira', cpf: '321.654.987-00', status: 'ferias', tipoContrato: 'clt', cargo: 'Analista Financeiro', funcao: 'Analista Financeiro Sr.', departamento: 'Financeiro', filialId: 'fil-1', filialNome: 'Matriz — São Paulo', empresaId: 'emp-1', obraAlocadoId: null, obraAlocadoNome: null, centroCustoId: null, centroCustoNome: null, dataAdmissao: '2021-09-01', dataDesligamento: null, salarioBase: 9200, email: 'ana.ferreira@jogab.com.br', telefone: '(11) 99999-0004', cidade: 'São Paulo', uf: 'SP', gestorNome: 'Patricia Fernandes', gestorId: 'resp-5', createdAt: '2021-08-25T10:00:00Z', updatedAt: '2026-03-01T09:00:00Z' },
  { id: 'func-5', matricula: 'MAT-005', nome: 'Carlos Mendes', cpf: '654.987.321-00', status: 'afastado', tipoContrato: 'clt', cargo: 'Pedreiro', funcao: 'Pedreiro Oficial', departamento: 'Produção', filialId: 'fil-3', filialNome: 'Filial — Belo Horizonte', empresaId: 'emp-1', obraAlocadoId: 'obra-4', obraAlocadoNome: 'Ponte BR-101', centroCustoId: 'cc-4', centroCustoNome: 'Obra Ponte — Produção', dataAdmissao: '2019-04-15', dataDesligamento: null, salarioBase: 3800, email: 'carlos.mendes@jogab.com.br', telefone: '(31) 97777-0005', cidade: 'Campinas', uf: 'SP', gestorNome: 'Marcos Santos', gestorId: 'resp-4', createdAt: '2019-04-10T10:00:00Z', updatedAt: '2026-02-15T14:00:00Z' },
  { id: 'func-6', matricula: 'MAT-006', nome: 'Luciana Almeida', cpf: '789.123.456-00', status: 'ativo', tipoContrato: 'pj', cargo: 'Arquiteta', funcao: 'Arquiteta Projetista', departamento: 'Projetos', filialId: 'fil-1', filialNome: 'Matriz — São Paulo', empresaId: 'emp-1', obraAlocadoId: 'obra-3', obraAlocadoNome: 'Torre Empresarial', centroCustoId: 'cc-5', centroCustoNome: 'Obra Torre — Projetos', dataAdmissao: '2024-01-10', dataDesligamento: null, salarioBase: 15000, email: 'luciana.almeida@jogab.com.br', telefone: '(11) 99999-0006', cidade: 'São Paulo', uf: 'SP', gestorNome: 'Roberto Lima', gestorId: 'resp-3', createdAt: '2024-01-05T10:00:00Z', updatedAt: '2026-03-19T10:00:00Z' },
  { id: 'func-7', matricula: 'MAT-007', nome: 'Roberto Nascimento', cpf: '147.258.369-00', status: 'desligado', tipoContrato: 'clt', cargo: 'Eletricista', funcao: 'Eletricista Industrial', departamento: 'Produção', filialId: 'fil-3', filialNome: 'Filial — Belo Horizonte', empresaId: 'emp-1', obraAlocadoId: null, obraAlocadoNome: null, centroCustoId: null, centroCustoNome: null, dataAdmissao: '2020-08-01', dataDesligamento: '2026-01-31', salarioBase: 4500, email: 'roberto.nasc@jogab.com.br', telefone: '(31) 97777-0007', cidade: 'Belo Horizonte', uf: 'MG', gestorNome: 'Carlos Oliveira', gestorId: 'resp-1', createdAt: '2020-07-25T10:00:00Z', updatedAt: '2026-01-31T18:00:00Z' },
  { id: 'func-8', matricula: 'MAT-008', nome: 'Fernanda Costa', cpf: '258.369.147-00', status: 'ativo', tipoContrato: 'clt', cargo: 'Encarregada', funcao: 'Encarregada de Obras', departamento: 'Produção', filialId: 'fil-2', filialNome: 'Filial — Rio de Janeiro', empresaId: 'emp-1', obraAlocadoId: 'obra-2', obraAlocadoNome: 'Residencial Parque', centroCustoId: 'cc-6', centroCustoNome: 'Obra Parque — Encarregados', dataAdmissao: '2021-03-01', dataDesligamento: null, salarioBase: 5800, email: 'fernanda.costa@jogab.com.br', telefone: '(21) 98888-0008', cidade: 'Rio de Janeiro', uf: 'RJ', gestorNome: 'Ana Souza', gestorId: 'resp-2', createdAt: '2021-02-20T10:00:00Z', updatedAt: '2026-03-18T09:00:00Z' },
  { id: 'func-9', matricula: 'MAT-009', nome: 'Ricardo Barbosa', cpf: '369.147.258-00', status: 'ativo', tipoContrato: 'temporario', cargo: 'Auxiliar de Obras', funcao: 'Auxiliar Geral', departamento: 'Produção', filialId: 'fil-1', filialNome: 'Matriz — São Paulo', empresaId: 'emp-1', obraAlocadoId: 'obra-1', obraAlocadoNome: 'Edifício Aurora', centroCustoId: 'cc-7', centroCustoNome: 'Obra Aurora — Auxiliares', dataAdmissao: '2025-11-01', dataDesligamento: null, salarioBase: 2200, email: 'ricardo.barbosa@jogab.com.br', telefone: '(11) 99999-0009', cidade: 'São Paulo', uf: 'SP', gestorNome: 'João Silva', gestorId: 'func-1', createdAt: '2025-10-25T10:00:00Z', updatedAt: '2026-03-19T14:00:00Z' },
  { id: 'func-10', matricula: 'MAT-010', nome: 'Patrícia Rocha', cpf: '111.222.333-44', status: 'admissao_pendente', tipoContrato: 'clt', cargo: 'Almoxarife', funcao: 'Almoxarife de Obra', departamento: 'Estoque', filialId: 'fil-1', filialNome: 'Matriz — São Paulo', empresaId: 'emp-1', obraAlocadoId: 'obra-1', obraAlocadoNome: 'Edifício Aurora', centroCustoId: 'cc-8', centroCustoNome: 'Obra Aurora — Almoxarifado', dataAdmissao: '2026-04-01', dataDesligamento: null, salarioBase: 3200, email: 'patricia.rocha@jogab.com.br', telefone: '(11) 99999-0010', cidade: 'São Paulo', uf: 'SP', gestorNome: 'Carlos Oliveira', gestorId: 'resp-1', createdAt: '2026-03-15T10:00:00Z', updatedAt: '2026-03-19T10:00:00Z' },
  { id: 'func-11', matricula: 'MAT-011', nome: 'Luan Ferreira', cpf: '222.333.444-55', status: 'desligado', tipoContrato: 'clt', cargo: 'Operador de Equipamentos', funcao: 'Operador de Equipamentos', departamento: 'Produção', filialId: 'fil-3', filialNome: 'Filial — Belo Horizonte', empresaId: 'emp-1', obraAlocadoId: null, obraAlocadoNome: null, centroCustoId: 'cc-9', centroCustoNome: 'Obra Ponte — Equipamentos', dataAdmissao: '2025-07-10', dataDesligamento: '2026-02-28', salarioBase: 4700, email: 'luan.ferreira@jogab.com.br', telefone: '(31) 97777-0011', cidade: 'Belo Horizonte', uf: 'MG', gestorNome: 'Marcos Santos', gestorId: 'resp-4', createdAt: '2025-07-01T10:00:00Z', updatedAt: '2026-02-28T17:00:00Z' },
];

export function toFuncionarioListItem(func: Funcionario): FuncionarioListItem {
  return { id: func.id, matricula: func.matricula, nome: func.nome, cpf: func.cpf, status: func.status, tipoContrato: func.tipoContrato, cargo: func.cargo, funcao: func.funcao, departamento: func.departamento, filialNome: func.filialNome, obraAlocadoNome: func.obraAlocadoNome, dataAdmissao: func.dataAdmissao, salarioBase: func.salarioBase };
}

export function calcularFuncionariosKpis(funcionarios: Funcionario[]): FuncionariosKpis {
  const ativos = funcionarios.filter((f) => f.status === 'ativo');
  return { totalFuncionarios: funcionarios.length, ativos: ativos.length, afastados: funcionarios.filter((f) => f.status === 'afastado').length, ferias: funcionarios.filter((f) => f.status === 'ferias').length, desligados: funcionarios.filter((f) => f.status === 'desligado').length, custoFolhaEstimado: ativos.reduce((acc, f) => acc + f.salarioBase, 0) };
}

export function gerarFuncionarioResumoBlocos(func: Funcionario): FuncionarioResumoBloco[] {
  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  const alocacoes = getAlocacoesByFuncionarioId(func.id);
  const ativa = alocacoes.find((item) => item.status === 'ativa') ?? null;
  const planejada = alocacoes.find((item) => item.status === 'planejada') ?? null;
  const horasMes = alocacoes.reduce((acc, item) => acc + Math.round(item.percentual / 20), 0);

  return [
    {
      titulo: 'Contrato',
      itens: [
        { label: 'Tipo', valor: func.tipoContrato.toUpperCase() },
        { label: 'Admissão', valor: new Date(func.dataAdmissao).toLocaleDateString('pt-BR'), destaque: true },
        { label: 'Salário Base', valor: fmt(func.salarioBase), destaque: true },
        { label: 'Cargo', valor: func.cargo },
      ],
    },
    {
      titulo: 'Alocação',
      itens: [
        { label: 'Obra ativa', valor: ativa?.obraNome ?? func.obraAlocadoNome ?? 'Sem alocação', destaque: Boolean(ativa?.obraNome ?? func.obraAlocadoNome) },
        { label: 'Centro de custo', valor: ativa?.centroCustoNome ?? func.centroCustoNome ?? 'N/A' },
        { label: 'Próxima alocação', valor: planejada?.obraNome ?? 'Sem planejamento' },
        { label: 'Rateio atual', valor: ativa ? `${ativa.percentual}%` : '0%' },
      ],
    },
    {
      titulo: 'Provisões',
      itens: [
        { label: 'Férias provisionadas', valor: fmt(func.salarioBase * 1.33 / 12) },
        { label: '13º provisionado', valor: fmt(func.salarioBase / 12) },
        { label: 'FGTS estimado', valor: fmt(func.salarioBase * 0.08) },
        { label: 'INSS estimado', valor: fmt(func.salarioBase * 0.11) },
      ],
    },
    {
      titulo: 'Horas Extras',
      itens: [
        { label: 'Horas extras mês', valor: `${horasMes}h` },
        { label: 'Banco de horas', valor: `${Math.max(0, horasMes - 2)}h` },
        { label: 'Valor estimado HE', valor: fmt(func.salarioBase / 220 * 1.5 * Math.max(1, horasMes)) },
      ],
    },
    {
      titulo: 'Documentos',
      itens: [
        { label: 'Documentos ativos', valor: String(Math.max(3, alocacoes.length + 2)) },
        { label: 'Vencendo em 30 dias', valor: String(alocacoes.filter((item) => item.status !== 'encerrada').length > 1 ? 1 : 0), destaque: true },
        { label: 'ASOs pendentes', valor: String(func.status === 'admissao_pendente' ? 1 : 0) },
      ],
    },
    {
      titulo: 'FOPAG',
      itens: [
        { label: 'Folha mês atual', valor: fmt(func.salarioBase * 1.35) },
        { label: 'Competência ativa', valor: '03/2026' },
        { label: 'Status FOPAG', valor: func.status === 'ativo' || func.status === 'ferias' ? 'Incluído' : 'Monitorado', destaque: func.status === 'ativo' || func.status === 'ferias' },
      ],
    },
  ];
}
