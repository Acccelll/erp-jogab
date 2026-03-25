// Módulo Obras — entidade central do ERP JOGAB
export { ObrasListPage } from './pages/ObrasListPage';
export { ObraVisaoGeralPage } from './pages/ObraVisaoGeralPage';
export { ObraCronogramaPage } from './pages/ObraCronogramaPage';
export { ObraEquipePage } from './pages/ObraEquipePage';
export { ObraComprasPage } from './pages/ObraComprasPage';
export { ObraFinanceiroPage } from './pages/ObraFinanceiroPage';
export { ObraDocumentosPage } from './pages/ObraDocumentosPage';
export { ObraContratosPage } from './pages/ObraContratosPage';
export { ObraEstoquePage } from './pages/ObraEstoquePage';
export { ObraMedicoesPage } from './pages/ObraMedicoesPage';
export { ObraRhPage } from './pages/ObraRhPage';
export { ObraRiscosPage } from './pages/ObraRiscosPage';

// Re-export types para uso em outros módulos
export type {
  Obra,
  ObraListItem,
  ObraStatus,
  ObraTipo,
  ObrasKpis,
  ObraVisaoGeralKpis,
} from './types';
