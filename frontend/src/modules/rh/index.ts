// Módulo RH — gestão de funcionários do ERP JOGAB
export { FuncionariosListPage } from './pages/FuncionariosListPage';
export { FuncionarioDetailPage } from './pages/FuncionarioDetailPage';

// Re-export types para uso em outros módulos
export type {
  Funcionario,
  FuncionarioListItem,
  FuncionarioStatus,
  TipoContrato,
  FuncionariosKpis,
} from './types';
