import { useQuery } from '@tanstack/react-query';
import { fetchSocialSnapshots } from '../services/social.service';
import type { SocialSnapshotFilters } from '../types';

export function useSocialSnapshots(filters?: SocialSnapshotFilters) {
  return useQuery({
    queryKey: ['social-snapshots', filters],
    queryFn: () => fetchSocialSnapshots(filters),
  });
}
