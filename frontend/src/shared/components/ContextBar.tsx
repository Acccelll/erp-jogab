import { Building2, MapPin, HardHat, Calendar } from 'lucide-react';
import { useContextStore } from '@/shared/stores';
import { formatCompetencia } from '@/shared/lib/utils';
import type { SelectOption } from '@/shared/types';

// Mock data — will be replaced by API calls in future phases
const mockEmpresas: SelectOption[] = [
  { value: 'emp-1', label: 'JOGAB Engenharia Ltda' },
  { value: 'emp-2', label: 'JOGAB Construções S.A.' },
];

const mockFiliais: SelectOption[] = [
  { value: 'fil-1', label: 'Matriz — São Paulo' },
  { value: 'fil-2', label: 'Filial — Rio de Janeiro' },
  { value: 'fil-3', label: 'Filial — Belo Horizonte' },
];

const mockObras: SelectOption[] = [
  { value: 'obra-1', label: 'OBR-001 — Edifício Aurora' },
  { value: 'obra-2', label: 'OBR-002 — Residencial Parque' },
  { value: 'obra-3', label: 'OBR-003 — Torre Empresarial' },
  { value: 'obra-4', label: 'OBR-004 — Ponte BR-101' },
];

const mockCompetencias: SelectOption[] = [
  { value: '2026-03', label: '03/2026' },
  { value: '2026-02', label: '02/2026' },
  { value: '2026-01', label: '01/2026' },
  { value: '2025-12', label: '12/2025' },
];

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
    setEmpresa,
    setFilial,
    setObra,
    setCompetencia,
  } = useContextStore();

  const formattedCompetencia = competencia ? formatCompetencia(competencia) : null;

  // Count active context selections for the indicator
  const activeCount = [empresaId, filialId, obraId, competencia].filter(Boolean).length;

  return (
    <div className="flex items-center gap-3 overflow-x-auto border-b border-border-light bg-surface-secondary px-4 py-1.5">
      <ContextSelect
        icon={<Building2 size={14} />}
        label="Empresa"
        value={empresaId}
        options={mockEmpresas}
        onChange={setEmpresa}
        placeholder="Empresa"
      />

      <div className="h-4 w-px shrink-0 bg-gray-200" />

      <ContextSelect
        icon={<MapPin size={14} />}
        label="Filial"
        value={filialId}
        options={mockFiliais}
        onChange={setFilial}
        placeholder="Filial"
      />

      <div className="h-4 w-px shrink-0 bg-gray-200" />

      <ContextSelect
        icon={<HardHat size={14} />}
        label="Obra"
        value={obraId}
        options={mockObras}
        onChange={setObra}
        placeholder="Todas as obras"
      />

      <div className="h-4 w-px shrink-0 bg-gray-200" />

      <ContextSelect
        icon={<Calendar size={14} />}
        label="Competência"
        value={competencia}
        options={mockCompetencias}
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
