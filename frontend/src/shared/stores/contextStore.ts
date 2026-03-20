import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ContextoGlobal } from '@/shared/types';

interface ContextState extends ContextoGlobal {
  setEmpresa: (empresaId: string | null) => void;
  setFilial: (filialId: string | null) => void;
  setObra: (obraId: string | null) => void;
  setCompetencia: (competencia: string | null) => void;
  setPeriodo: (inicio: string | null, fim: string | null) => void;
  setCentroCusto: (centroCustoId: string | null) => void;
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

      resetContext: () => set(initialContext),
    }),
    {
      name: 'erp-jogab-context',
    },
  ),
);
