import { useQuery } from '@tanstack/react-query';
import { fetchSocialDashboard } from '../services/social.service';

export function useSocialDashboard() {
  return useQuery({
    queryKey: ['social-dashboard'],
    queryFn: fetchSocialDashboard,
  });
}
