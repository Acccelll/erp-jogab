import { useQuery } from '@tanstack/react-query';
import type { AdminFiltersData } from '../types';
import { fetchLogs } from '../services/admin.service';
export function useLogs(filters?: AdminFiltersData) { return useQuery({ queryKey: ['admin-logs', filters], queryFn: () => fetchLogs(filters) }); }
