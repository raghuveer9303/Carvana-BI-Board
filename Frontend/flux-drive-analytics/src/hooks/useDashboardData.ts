import { useQuery } from '@tanstack/react-query';
import { fetchDashboardData } from '@/services/api';

export const useDashboardData = (refreshInterval = 30000) => {
  return useQuery({
    queryKey: ['dashboard-data'],
    queryFn: fetchDashboardData,
    refetchInterval: refreshInterval,
    staleTime: 15000, // Consider data stale after 15 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};