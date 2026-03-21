// Módulo RH — gestão de funcionários do ERP JOGAB
export { FuncionariosListPage } from './pages/FuncionariosListPage';
export { FuncionarioDetailPage } from './pages/FuncionarioDetailPage';
export { FuncionarioContratoPage } from './pages/FuncionarioContratoPage';
export { FuncionarioAlocacoesPage } from './pages/FuncionarioAlocacoesPage';
export { FuncionarioProvisoesPage } from './pages/FuncionarioProvisoesPage';
export { FuncionarioHorasExtrasPage } from './pages/FuncionarioHorasExtrasPage';
export { FuncionarioFopagPage } from './pages/FuncionarioFopagPage';

// Re-export types para uso em outros módulos
export type {
  Funcionario,
  FuncionarioListItem,
  FuncionarioStatus,
  TipoContrato,
  FuncionariosKpis,
} from './types';
