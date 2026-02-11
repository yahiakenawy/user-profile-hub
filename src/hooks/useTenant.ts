import { useQuery } from '@tanstack/react-query';
import { tenantApi } from '@/lib/api';

export interface Tenant {
  name: string;
  description: string | null;
  profile_pic: string | null;
  is_active: boolean;
  style: string;
  theme: string;
  plan_type: string | null;
  tier_type: string | null;
  city: string | null;
  typeOfOrg: string;
  domain: string;
  email?: string;
  phone?: string;
}

export const useTenant = () => {
  return useQuery<Tenant>({
    queryKey: ['tenant'],
    queryFn: async () => {
      try {
        const response = await tenantApi.getTenantInfo();
        return response.data;
      } catch (error) {
        console.error('Tenant API failed:', error);
        return {
          name: 'Zakerai Academy',
          description: null,
          profile_pic: null,
          is_active: true,
          style: '1',
          theme: '1',
          plan_type: null,
          tier_type: null,
          city: null,
          typeOfOrg: 'school',
          domain: 'demo',
        } as Tenant;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};
