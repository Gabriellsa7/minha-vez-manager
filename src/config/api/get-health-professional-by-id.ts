import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IHealthProfessional } from '../entities/health-profissional/health-professional.entity';

const GET_HEALTH_PROFESSIONALS_BY_USER_ID =
  'GET_HEALTH_PROFESSIONALS_BY_USER_ID';

export type GetHealthProfessionalById = IHealthProfessional;

const getHealthProfessionalById = async (
  id: string
): Promise<GetHealthProfessionalById> => {
  const path = `/health-professionals/${id}`;

  try {
    const response = await apiClient.get<GetHealthProfessionalById>(path);

    return response.data;
  } catch {
    throw new Error(path);
  }
};

export const useHealthProfessionalById = (
  userId: string | undefined,
  options?: Omit<
    UseQueryOptions<GetHealthProfessionalById>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: [GET_HEALTH_PROFESSIONALS_BY_USER_ID, userId],
    queryFn: () => getHealthProfessionalById(userId!),
    enabled: Boolean(userId),
    ...options,
  });
};
