import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IHealthProfessional } from '../entities/health-profissional/health-professional.entity';

export const GET_HEALTH_PROFESSIONALS_BY_USER_ID =
  'GET_HEALTH_PROFESSIONALS_BY_USER_ID';

export type GetHealthProfessionalsByUserId = IHealthProfessional[];

const getHealthProfessionalsByUserId = async (
  userId: string
): Promise<GetHealthProfessionalsByUserId> => {
  const path = `/health-professionals/user/${userId}`;

  try {
    const response = await apiClient.get<GetHealthProfessionalsByUserId>(path);

    return response.data;
  } catch {
    throw new Error(path);
  }
};

export const useHealthProfessionalsByUserId = (
  userId: string | undefined,
  options?: Omit<
    UseQueryOptions<GetHealthProfessionalsByUserId>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: [GET_HEALTH_PROFESSIONALS_BY_USER_ID, userId],
    queryFn: () => getHealthProfessionalsByUserId(userId!),
    enabled: Boolean(userId),
    ...options,
  });
};
