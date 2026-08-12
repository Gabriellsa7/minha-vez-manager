import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IExamAvailabilityRule } from '../entities/exam-availability/exam-availability.entity';

export const GET_EXAM_AVAILABILITY_RULES_KEY = 'GET_EXAM_AVAILABILITY_RULES_KEY';

const getExamAvailabilityRules = async (
  healthUnitId: string
): Promise<IExamAvailabilityRule[]> => {
  const path = `/health-units/${healthUnitId}/exam-availability-rules`;

  const response = await apiClient.get<IExamAvailabilityRule[]>(path);

  return response.data;
};

export const useGetExamAvailabilityRules = (
  healthUnitId: string | undefined,
  options?: Omit<UseQueryOptions<IExamAvailabilityRule[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [GET_EXAM_AVAILABILITY_RULES_KEY, healthUnitId],
    queryFn: () => getExamAvailabilityRules(healthUnitId!),
    enabled: Boolean(healthUnitId),
    ...options,
  });
};
