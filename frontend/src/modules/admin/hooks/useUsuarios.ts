import { useQuery } from '@tanstack/react-query';
import type { AdminFiltersData } from '../types';
import { fetchUsuarios } from '../services/admin.service';
export function useUsuarios(filters?: AdminFiltersData) { return useQuery({ queryKey: ['admin-usuarios', filters], queryFn: () => fetchUsuarios(filters) }); }
