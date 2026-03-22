import { Building2, MapPin, HardHat, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchContextOptions } from '@/shared/lib/context.service';
import { useContextStore } from '@/shared/stores';
import { formatCompetencia } from '@/shared/lib/utils';
import type { SelectOption } from '@/shared/types';

interface ContextSelectProps {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  options: SelectOption[];
  onChange: (value: string | null) => void;
  placeholder: string;
}

function ContextSelect({ icon, label, value, options, onChange, placeholder }: ContextSelectProps) {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <span className="text-gray-400">{icon}</span>
      <label className="sr-only">{label}</label>
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || null)}
        className="h-7 rounded border border-gray-200 bg-white px-2 pr-7 text-xs font-medium text-gray-700 transition-colors hover:border-gray-300 focus:border-jogab-500 focus:outline-none focus:ring-1 focus:ring-jogab-500"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function ContextBar() {
  const {
    empresaId,
    filialId,
    obraId,
    competencia,
    options,
    setEmpresa,
    setFilial,
    setObra,
    setCompetencia,
  } = useContextStore();
  const { data } = useQuery({
    queryKey: ['context-options'],
    queryFn: fetchContextOptions,
    staleTime: 10 * 60 * 1000,
  });

  const mergedOptions = data ?? options;
  const empresas = mergedOptions?.empresas ?? [];
  const filiais = (mergedOptions?.filiais ?? []).filter((item) => !empresaId || item.empresaId === empresaId);
  const obras = (mergedOptions?.obras ?? []).filter((item) => !filialId || item.filialId === filialId);
  const competencias = mergedOptions?.competencias ?? [];

  const formattedCompetencia = competencia ? formatCompetencia(competencia) : null;

  // Count active context selections for the indicator
  const activeCount = [empresaId, filialId, obraId, competencia].filter(Boolean).length;

  return (
    <div className="flex items-center gap-3 overflow-x-auto border-b border-border-light bg-surface-secondary px-4 py-1.5">
      <ContextSelect
        icon={<Building2 size={14} />}
        label="Empresa"
        value={empresaId}
        options={empresas}
        onChange={setEmpresa}
        placeholder="Empresa"
      />

      <div className="h-4 w-px shrink-0 bg-gray-200" />

      <ContextSelect
        icon={<MapPin size={14} />}
        label="Filial"
        value={filialId}
        options={filiais}
        onChange={setFilial}
        placeholder="Filial"
      />

      <div className="h-4 w-px shrink-0 bg-gray-200" />

      <ContextSelect
        icon={<HardHat size={14} />}
        label="Obra"
        value={obraId}
        options={obras}
        onChange={setObra}
        placeholder="Todas as obras"
      />

      <div className="h-4 w-px shrink-0 bg-gray-200" />

      <ContextSelect
        icon={<Calendar size={14} />}
        label="Competência"
        value={competencia}
        options={competencias}
        onChange={setCompetencia}
        placeholder="Competência"
      />

      {/* Active context indicator */}
      {activeCount > 0 && (
        <span className="ml-auto shrink-0 rounded-full bg-jogab-50 px-2 py-0.5 text-[10px] font-medium text-jogab-600">
          {activeCount} {activeCount === 1 ? 'filtro' : 'filtros'}
        </span>
      )}

      {/* Active context summary for screen readers */}
      {(empresaId ?? filialId ?? obraId ?? formattedCompetencia) && (
        <span className="sr-only">
          Contexto ativo: {empresaId ? `Empresa ${empresaId}` : ''}
          {filialId ? `, Filial ${filialId}` : ''}
          {obraId ? `, Obra ${obraId}` : ''}
          {formattedCompetencia ? `, Competência ${formattedCompetencia}` : ''}
        </span>
      )}
    </div>
  );
}
