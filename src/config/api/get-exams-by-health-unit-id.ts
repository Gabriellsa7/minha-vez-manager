import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IExam } from '../entities/exam/exam.entity';

export const GET_EXAMS_BY_HEALTH_UNIT_ID_KEY = 'GET_EXAMS_BY_HEALTH_UNIT_ID_KEY';

const getExamsByHealthUnitId = async (
  healthUnitId: string
): Promise<IExam[]> => {
  const path = `/health-units/${healthUnitId}/exams`;

  const response = await apiClient.get<IExam[]>(path);

  return response.data;
};

export const useGetExamsByHealthUnitId = (
  healthUnitId: string | undefined,
  options?: Omit<UseQueryOptions<IExam[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [GET_EXAMS_BY_HEALTH_UNIT_ID_KEY, healthUnitId],
    queryFn: () => getExamsByHealthUnitId(healthUnitId!),
    enabled: Boolean(healthUnitId),
    ...options,
  });
};
