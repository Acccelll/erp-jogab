import { useQuery } from '@tanstack/react-query';
import { fetchSocialAlertas } from '../services/social.service';

export function useSocialAlertas() {
  return useQuery({
    queryKey: ['social-alertas'],
    queryFn: fetchSocialAlertas,
  });
}
