import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IHealthUnit } from '../entities/health-unit/health-unit.entity';

export const GET_HEALTH_UNITS_BY_USER_ID_KEY =
  'GET_HEALTH_UNITS_BY_USER_ID_KEY';

export type GetHealthUnitsByUserIdResponse = IHealthUnit[];

const getHealthUnitsByUserId = async (
  userId: string
): Promise<GetHealthUnitsByUserIdResponse> => {
  const path = `/health-units/user/${userId}`;

  try {
    const response = await apiClient.get<GetHealthUnitsByUserIdResponse>(path);

    return response.data;
  } catch {
    throw new Error(path);
  }
};

export const useHealthUnitsByUserId = (
  userId: string | undefined,
  options?: Omit<
    UseQueryOptions<GetHealthUnitsByUserIdResponse>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: [GET_HEALTH_UNITS_BY_USER_ID_KEY, userId],
    queryFn: () => getHealthUnitsByUserId(userId!),
    enabled: Boolean(userId),
    ...options,
  });
};
