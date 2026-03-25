import { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell, LogOut, User, Search, ChevronDown, HardHat, Calendar } from 'lucide-react';
import { useUIStore, useAuthStore, useContextStore } from '@/shared/stores';
import { useQuery } from '@tanstack/react-query';
import { fetchContextOptions } from '@/shared/lib/context.service';
import { formatCompetencia } from '@/shared/lib/utils';
import { cn } from '@/shared/lib/utils';

/** Maps route prefixes to human-readable breadcrumb labels */
const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  obras: 'Obras',
  rh: 'RH',
  funcionarios: 'Funcionários',
  'horas-extras': 'Horas Extras',
  fopag: 'FOPAG',
  compras: 'Compras',
  fiscal: 'Fiscal',
  financeiro: 'Financeiro',
  estoque: 'Estoque',
  medicoes: 'Medições',
  documentos: 'Documentos',
  relatorios: 'Relatórios',
  admin: 'Administração',
  perfil: 'Perfil',
  lancamentos: 'Lançamentos',
  solicitacoes: 'Solicitações',
  cotacoes: 'Cotações',
  pedidos: 'Pedidos',
  fechamento: 'Fechamento',
  aprovacao: 'Aprovação',
  fluxo: 'Fluxo de Caixa',
  'contas-pagar': 'Contas a Pagar',
  'contas-receber': 'Contas a Receber',
  cronograma: 'Cronograma',
  equipe: 'Equipe',
  contrato: 'Contrato',
  alocacoes: 'Alocações',
  'historico-salarial': 'Histórico Salarial',
  ferias: 'Férias',
  'decimo-terceiro': '13º',
  provisoes: 'Provisões',
};

/** Segments that are likely dynamic entity IDs */
function isIdSegment(seg: string): boolean {
  // UUID-like or numeric IDs
  return /^[0-9a-f-]{8,}$/i.test(seg) || /^\d+$/.test(seg);
}

/**
 * Smart breadcrumb hook — resolves entity names from context/store
 * when navigating into detail pages (e.g., /obras/:obraId).
 */
interface Breadcrumb {
  label: string;
  href: string;
  isLast: boolean;
}

function useBreadcrumbs(): Breadcrumb[] {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);
  const contextOptions = useContextStore((s) => s.options);
  const obras = contextOptions?.obras ?? [];

  return useMemo(() => {
    const crumbs: Breadcrumb[] = [];
    let pathSoFar = '';

    for (let i = 0; i < segments.length && crumbs.length < 3; i++) {
      const seg = segments[i];
      pathSoFar += `/${seg}`;
      const known = routeLabels[seg];

      let label: string;
      if (known) {
        label = known;
      } else if (isIdSegment(seg)) {
        const parentSeg = segments[i - 1];
        if (parentSeg === 'obras' || (parentSeg === undefined && segments[0] === 'obras')) {
          const obra = obras.find((o) => o.value === seg);
          label = obra?.label ?? `#${seg.slice(0, 6)}`;
        } else {
          label = `#${seg.slice(0, 6)}`;
        }
      } else {
        label = seg;
      }

      crumbs.push({ label, href: pathSoFar, isLast: false });
    }

    // Mark last crumb
    if (crumbs.length > 0) {
      crumbs[crumbs.length - 1] = { ...crumbs[crumbs.length - 1], isLast: true };
    }

    return crumbs;
  }, [segments, obras]);
}

/** Compact context selector for Topbar */
function ContextSelectorButton({
  icon,
  label,
  value,
  options,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  options: { value: string; label: string }[];
  onChange: (value: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-md border border-border-default bg-surface-muted px-2.5 py-1 text-sm transition-colors hover:bg-surface-soft"
      >
        <span className="text-text-subtle">{icon}</span>
        <span className="text-xs text-text-subtle">{label}</span>
        <span className="max-w-[140px] truncate font-medium text-text-body">{selectedLabel ?? 'Todas'}</span>
        <ChevronDown className="h-3 w-3 text-text-subtle" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 max-h-64 w-56 overflow-auto rounded-md border border-border-default bg-surface py-1 shadow-lg">
          <button
            type="button"
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
            className={cn(
              'flex w-full px-3 py-1.5 text-left text-sm hover:bg-surface-soft',
              !value ? 'font-medium text-text-strong' : 'text-text-muted',
            )}
          >
            Todas
          </button>
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={cn(
                'flex w-full px-3 py-1.5 text-left text-sm hover:bg-surface-soft',
                value === opt.value ? 'font-medium text-text-strong' : 'text-text-muted',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Topbar() {
  const { setSidebarCollapsed, sidebarCollapsed } = useUIStore();
  const usuario = useAuthStore((s) => s.usuario);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const { obraId, competencia, options, setObra, setCompetencia } = useContextStore();

  const { data: contextData } = useQuery({
    queryKey: ['context-options'],
    queryFn: fetchContextOptions,
    staleTime: 10 * 60 * 1000,
  });

  const mergedOptions = contextData ?? options;
  const obras = mergedOptions?.obras ?? [];
  const competencias = mergedOptions?.competencias ?? [];

  const breadcrumbs = useBreadcrumbs();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [userMenuOpen]);

  return (
    <header className="flex h-11 items-center justify-between border-b border-border-default bg-surface px-4">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="rounded-md p-1.5 text-text-muted hover:bg-surface-soft hover:text-text-body lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu size={18} />
        </button>

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1 text-sm" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, idx) => (
            <span key={`${crumb}-${idx}`} className="flex items-center gap-1">
              {idx > 0 && <span className="text-border-default">/</span>}
              <span
                className={cn(idx === breadcrumbs.length - 1 ? 'font-semibold text-brand-primary' : 'text-text-muted')}
              >
                {crumb}
              </span>
            </span>
          ))}
        </nav>
      </div>

      {/* Right side — context selectors + actions */}
      <div className="flex items-center gap-2">
        {/* Context selectors */}
        <ContextSelectorButton
          icon={<HardHat size={14} />}
          label="Obra"
          value={obraId}
          options={obras}
          onChange={setObra}
        />
        <ContextSelectorButton
          icon={<Calendar size={14} />}
          label=""
          value={competencia}
          options={competencias.map((c) => ({ ...c, label: formatCompetencia(c.value) }))}
          onChange={setCompetencia}
        />

        {/* Search placeholder */}
        <button
          type="button"
          className="hidden items-center gap-2 rounded-md border border-border-default bg-surface-muted px-2.5 py-1 text-sm text-text-subtle transition-colors hover:border-border-soft hover:bg-surface-soft focus-within:border-brand-secondary focus-within:ring-1 focus-within:ring-brand-secondary/20 md:flex"
        >
          <Search size={14} />
          <span className="text-xs">Buscar...</span>
          <kbd className="ml-2 rounded border border-border-soft bg-surface px-1 py-0.5 text-[10px] font-medium text-text-subtle">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="relative rounded-md p-1.5 text-text-muted hover:bg-surface-soft hover:text-text-body"
          aria-label="Notificações"
        >
          <Bell size={16} />
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-danger" />
        </button>

        {/* User dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-surface-soft"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary-soft text-[10px] font-semibold text-brand-primary">
              {usuario?.nome?.charAt(0)?.toUpperCase() ?? 'U'}
            </div>
            <span className="hidden max-w-[100px] truncate text-xs text-text-body md:inline">
              {usuario?.nome ?? 'Usuário'}
            </span>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-md border border-border-default bg-surface py-1 shadow-lg">
              <div className="border-b border-border-light px-3 py-2">
                <p className="text-sm font-medium text-text-strong">{usuario?.nome ?? 'Usuário'}</p>
                <p className="text-xs text-text-muted">{usuario?.email ?? 'usuario@jogab.com.br'}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setUserMenuOpen(false);
                  navigate('/perfil');
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text-body hover:bg-surface-soft"
              >
                <User size={14} />
                Meu Perfil
              </button>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setUserMenuOpen(false);
                  navigate('/login');
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger-soft"
              >
                <LogOut size={14} />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
