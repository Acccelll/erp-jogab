import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ContextBootstrapData, ContextOptionsResponse, ContextoGlobal } from '@/shared/types';

interface ContextState extends ContextoGlobal {
  options: ContextOptionsResponse | null;
  isInitialized: boolean;
  setEmpresa: (empresaId: string | null) => void;
  setFilial: (filialId: string | null) => void;
  setObra: (obraId: string | null) => void;
  setCompetencia: (competencia: string | null) => void;
  setPeriodo: (inicio: string | null, fim: string | null) => void;
  setCentroCusto: (centroCustoId: string | null) => void;
  initializeContext: (data: ContextBootstrapData) => void;
  resetContext: () => void;
}

const initialContext: ContextoGlobal = {
  empresaId: null,
  filialId: null,
  obraId: null,
  competencia: null,
  periodoInicio: null,
  periodoFim: null,
  centroCustoId: null,
};

export const useContextStore = create<ContextState>()(
  persist(
    (set) => ({
      ...initialContext,
      options: null,
      isInitialized: false,

      setEmpresa: (empresaId) =>
        set({ empresaId, filialId: null, obraId: null, centroCustoId: null }),

      setFilial: (filialId) =>
        set({ filialId, obraId: null, centroCustoId: null }),

      setObra: (obraId) =>
        set({ obraId, centroCustoId: null }),

      setCompetencia: (competencia) => set({ competencia }),

      setPeriodo: (periodoInicio, periodoFim) =>
        set({ periodoInicio, periodoFim }),

      setCentroCusto: (centroCustoId) => set({ centroCustoId }),

      initializeContext: ({ contexto, options }) =>
        set((state) => ({
          ...state,
          ...contexto,
          options,
          isInitialized: true,
        })),

      resetContext: () => set({ ...initialContext, options: null, isInitialized: false }),
    }),
    {
      name: 'erp-jogab-context',
    },
  ),
);
