import { describe, it, expect, beforeEach } from 'vitest';
import { useContextStore } from './contextStore';

describe('contextStore', () => {
  beforeEach(() => {
    useContextStore.getState().resetContext();
  });

  it('has correct initial state', () => {
    const state = useContextStore.getState();
    expect(state.empresaId).toBeNull();
    expect(state.filialId).toBeNull();
    expect(state.obraId).toBeNull();
    expect(state.competencia).toBeNull();
    expect(state.periodoInicio).toBeNull();
    expect(state.periodoFim).toBeNull();
    expect(state.centroCustoId).toBeNull();
    expect(state.options).toBeNull();
    expect(state.isInitialized).toBe(false);
  });

  it('setEmpresa sets empresaId and clears dependent fields', () => {
    const store = useContextStore.getState();
    store.setFilial('filial-1');
    store.setObra('obra-1');
    store.setCentroCusto('cc-1');

    store.setEmpresa('empresa-1');
    const state = useContextStore.getState();
    expect(state.empresaId).toBe('empresa-1');
    expect(state.filialId).toBeNull();
    expect(state.obraId).toBeNull();
    expect(state.centroCustoId).toBeNull();
  });

  it('setFilial sets filialId and clears dependent fields', () => {
    const store = useContextStore.getState();
    store.setObra('obra-1');
    store.setCentroCusto('cc-1');

    store.setFilial('filial-1');
    const state = useContextStore.getState();
    expect(state.filialId).toBe('filial-1');
    expect(state.obraId).toBeNull();
    expect(state.centroCustoId).toBeNull();
  });

  it('setObra sets obraId and clears centroCustoId', () => {
    const store = useContextStore.getState();
    store.setCentroCusto('cc-1');

    store.setObra('obra-1');
    const state = useContextStore.getState();
    expect(state.obraId).toBe('obra-1');
    expect(state.centroCustoId).toBeNull();
  });

  it('setCompetencia sets competencia', () => {
    useContextStore.getState().setCompetencia('2026-03');
    expect(useContextStore.getState().competencia).toBe('2026-03');
  });

  it('setPeriodo sets both periodoInicio and periodoFim', () => {
    useContextStore.getState().setPeriodo('2026-01-01', '2026-03-31');
    const state = useContextStore.getState();
    expect(state.periodoInicio).toBe('2026-01-01');
    expect(state.periodoFim).toBe('2026-03-31');
  });

  it('setCentroCusto sets centroCustoId', () => {
    useContextStore.getState().setCentroCusto('cc-123');
    expect(useContextStore.getState().centroCustoId).toBe('cc-123');
  });

  it('initializeContext sets full context with options', () => {
    useContextStore.getState().initializeContext({
      contexto: {
        empresaId: 'emp-1',
        filialId: 'fil-1',
        obraId: 'obra-1',
        competencia: '2026-03',
        periodoInicio: null,
        periodoFim: null,
        centroCustoId: null,
      },
      options: { empresas: [], filiais: [], obras: [] } as never,
    });

    const state = useContextStore.getState();
    expect(state.empresaId).toBe('emp-1');
    expect(state.filialId).toBe('fil-1');
    expect(state.obraId).toBe('obra-1');
    expect(state.competencia).toBe('2026-03');
    expect(state.isInitialized).toBe(true);
    expect(state.options).toBeTruthy();
  });

  it('resetContext returns to initial state', () => {
    const store = useContextStore.getState();
    store.setEmpresa('emp-1');
    store.setCompetencia('2026-03');
    store.resetContext();

    const state = useContextStore.getState();
    expect(state.empresaId).toBeNull();
    expect(state.competencia).toBeNull();
    expect(state.isInitialized).toBe(false);
    expect(state.options).toBeNull();
  });

  it('setEmpresa with null clears empresaId', () => {
    useContextStore.getState().setEmpresa('emp-1');
    useContextStore.getState().setEmpresa(null);
    expect(useContextStore.getState().empresaId).toBeNull();
  });
});
