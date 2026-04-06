import { useQuery } from '@tanstack/react-query';
import { fetchSocialPosts } from '../services/social.service';
import type { SocialPostsFilters } from '../types';

export function useSocialPosts(filters?: SocialPostsFilters) {
  return useQuery({
    queryKey: ['social-posts', filters],
    queryFn: () => fetchSocialPosts(filters),
  });
}
