import { useQuery } from '@tanstack/react-query';
import type { AdminFiltersData } from '../types';
import { fetchAdminDashboard } from '../services/admin.service';

export function useAdmin(filters?: AdminFiltersData) {
  return useQuery({ queryKey: ['admin-dashboard', filters], queryFn: () => fetchAdminDashboard(filters) });
}
