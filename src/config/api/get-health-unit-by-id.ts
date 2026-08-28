import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IHealthUnit } from '../entities/health-unit/health-unit.entity';

export const GET_HEALTH_UNIT_BY_ID_KEY = 'GET_HEALTH_UNIT_BY_ID_KEY';

const getHealthUnitById = async (id: string): Promise<IHealthUnit> => {
  const path = `/health-units/${id}`;

  const response = await apiClient.get<IHealthUnit>(path);

  return response.data;
};

export const useHealthUnitById = (
  id: string | undefined,
  options?: Omit<UseQueryOptions<IHealthUnit>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [GET_HEALTH_UNIT_BY_ID_KEY, id],
    queryFn: () => getHealthUnitById(id!),
    enabled: Boolean(id),
    ...options,
  });
};
