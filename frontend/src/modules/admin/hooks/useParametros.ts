import { useQuery } from '@tanstack/react-query';
import type { AdminFiltersData } from '../types';
import { fetchParametros } from '../services/admin.service';
export function useParametros(filters?: AdminFiltersData) { return useQuery({ queryKey: ['admin-parametros', filters], queryFn: () => fetchParametros(filters) }); }
