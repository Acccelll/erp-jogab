// Módulo Obras — entidade central do ERP JOGAB
export { ObrasListPage } from './pages/ObrasListPage';
export { ObraVisaoGeralPage } from './pages/ObraVisaoGeralPage';
export { ObraCronogramaPage } from './pages/ObraCronogramaPage';
export { ObraEquipePage } from './pages/ObraEquipePage';
export { ObraComprasPage } from './pages/ObraComprasPage';
export { ObraFinanceiroPage } from './pages/ObraFinanceiroPage';
export { ObraDocumentosPage } from './pages/ObraDocumentosPage';

// Re-export types para uso em outros módulos
export type {
  Obra,
  ObraListItem,
  ObraStatus,
  ObraTipo,
  ObrasKpis,
  ObraVisaoGeralKpis,
} from './types';
