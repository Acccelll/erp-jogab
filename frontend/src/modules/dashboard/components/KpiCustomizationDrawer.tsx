import { Check } from 'lucide-react';
import { usePreferencesStore, useDrawerStore } from '@/shared/stores';
import { useEffect, useCallback } from 'react';
import type { DashboardKpi } from '../types';

interface KpiCustomizationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  availableKpis: DashboardKpi[];
}

export function KpiCustomizationDrawer({ isOpen, onClose, availableKpis }: KpiCustomizationDrawerProps) {
  const { visibleKpiIds, setVisibleKpiIds } = usePreferencesStore();
  const { openDrawer } = useDrawerStore();

  const toggleKpi = useCallback((id: string) => {
    const currentIds = usePreferencesStore.getState().visibleKpiIds;
    if (currentIds.includes(id)) {
      setVisibleKpiIds(currentIds.filter((k) => k !== id));
    } else {
      setVisibleKpiIds([...currentIds, id]);
    }
  }, [setVisibleKpiIds]);

  useEffect(() => {
    if (isOpen) {
      openDrawer({
        title: 'Personalizar KPIs',
        content: (
          <div className="flex flex-col h-full">
            <p className="text-xs text-text-muted mb-6">
              Selecione quais indicadores você deseja visualizar no topo do dashboard.
            </p>
            <div className="flex-1 space-y-4">
              {availableKpis.map((kpi) => {
                const isVisible = visibleKpiIds.includes(kpi.id);
                return (
                  <button
                    key={kpi.id}
                    onClick={() => toggleKpi(kpi.id)}
                    className={`flex w-full items-center justify-between rounded-lg border p-4 transition-all ${
                      isVisible
                        ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                        : 'border-border-default bg-surface hover:bg-surface-soft'
                    }`}
                  >
                    <div className="text-left">
                      <p className="text-sm font-semibold">{kpi.label}</p>
                      {kpi.subtitle && <p className="text-[10px] opacity-70">{kpi.subtitle}</p>}
                    </div>
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      isVisible ? 'bg-brand-primary border-brand-primary text-white' : 'border-border-default'
                    }`}>
                      {isVisible && <Check size={12} />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex gap-3 border-t border-border-default pt-6">
              <button
                onClick={onClose}
                className="flex-1 rounded-md bg-brand-primary py-2 text-sm font-semibold text-white hover:bg-brand-primary-hover"
              >
                Salvar preferências
              </button>
            </div>
          </div>
        ),
      });
    }
  }, [isOpen, visibleKpiIds, availableKpis, openDrawer, toggleKpi, onClose]);

  return null;
}
