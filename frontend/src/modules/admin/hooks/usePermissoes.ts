import { useQuery } from '@tanstack/react-query';
import type { AdminFiltersData } from '../types';
import { fetchPermissoes } from '../services/admin.service';
export function usePermissoes(filters?: AdminFiltersData) { return useQuery({ queryKey: ['admin-permissoes', filters], queryFn: () => fetchPermissoes(filters) }); }
