// Módulo Obras — entidade central do ERP JOGAB
export { ObrasListPage } from './pages/ObrasListPage';
export { ObraVisaoGeralPage } from './pages/ObraVisaoGeralPage';

// Re-export types para uso em outros módulos
export type {
  Obra,
  ObraListItem,
  ObraStatus,
  ObraTipo,
  ObrasKpis,
  ObraVisaoGeralKpis,
} from './types';
