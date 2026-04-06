import {
  LayoutDashboard,
  Building2,
  Users,
  Clock,
  Receipt,
  ShoppingCart,
  FileText,
  Banknote,
  Package,
  Ruler,
  FolderOpen,
  BarChart2,
  Share2,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  tier?: 'primary' | 'secondary' | 'utility';
}

export interface MenuGroup {
  id: string;
  label: string;
  items: MenuItem[];
}

export const menuConfig: (MenuItem | MenuGroup)[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    tier: 'primary',
  },
  {
    id: 'operacoes',
    label: 'Operações',
    items: [
      { id: 'obras', label: 'Obras', path: '/obras', icon: Building2, tier: 'primary' },
      { id: 'medicoes', label: 'Medições', path: '/medicoes', icon: Ruler, tier: 'secondary' },
      { id: 'documentos', label: 'Documentos', path: '/documentos', icon: FolderOpen, tier: 'secondary' },
    ],
  },
  {
    id: 'rh',
    label: 'RH',
    items: [
      { id: 'rh-funcionarios', label: 'Funcionários', path: '/rh/funcionarios', icon: Users, tier: 'primary' },
      { id: 'horas-extras', label: 'Horas Extras', path: '/horas-extras', icon: Clock, tier: 'primary' },
      { id: 'fopag', label: 'FOPAG', path: '/fopag', icon: Receipt, tier: 'primary' },
    ],
  },
  {
    id: 'financeiro',
    label: 'Financeiro',
    items: [
      { id: 'financeiro-main', label: 'Financeiro', path: '/financeiro', icon: Banknote, tier: 'secondary' },
      { id: 'compras', label: 'Compras', path: '/compras', icon: ShoppingCart, tier: 'secondary' },
      { id: 'fiscal', label: 'Fiscal', path: '/fiscal', icon: FileText, tier: 'secondary' },
    ],
  },
  {
    id: 'estoque',
    label: 'Estoque',
    path: '/estoque',
    icon: Package,
    tier: 'secondary',
  },
  {
    id: 'relatorios',
    label: 'Relatórios',
    path: '/relatorios',
    icon: BarChart2,
    tier: 'utility',
  },

  {
    id: 'social',
    label: 'Redes Sociais',
    path: '/social',
    icon: Share2,
    tier: 'utility',
  },
  {
    id: 'admin',
    label: 'Administração',
    path: '/admin',
    icon: Settings,
    tier: 'utility',
  },
];
