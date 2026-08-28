import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IHealthProfessional } from '../entities/health-profissional/health-professional.entity';

export const GET_HEALTH_PROFESSIONALS_KEY = 'GET_HEALTH_PROFESSIONALS_KEY';

interface IPaginatedResult<T> {
  data: T[];
}

const getHealthProfessionals = async (): Promise<IHealthProfessional[]> => {
  const response =
    await apiClient.get<IPaginatedResult<IHealthProfessional>>(
      '/health-professionals'
    );

  return response.data.data;
};

export const useGetHealthProfessionals = (
  options?: Omit<UseQueryOptions<IHealthProfessional[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [GET_HEALTH_PROFESSIONALS_KEY],
    queryFn: getHealthProfessionals,
    ...options,
  });
};
