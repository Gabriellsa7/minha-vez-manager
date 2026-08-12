import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IExamAvailabilityBlackout } from '../entities/exam-availability/exam-availability.entity';

export const GET_EXAM_AVAILABILITY_BLACKOUTS_KEY =
  'GET_EXAM_AVAILABILITY_BLACKOUTS_KEY';

const getExamAvailabilityBlackouts = async (
  healthUnitId: string
): Promise<IExamAvailabilityBlackout[]> => {
  const path = `/health-units/${healthUnitId}/exam-availability-blackouts`;

  const response = await apiClient.get<IExamAvailabilityBlackout[]>(path);

  return response.data;
};

export const useGetExamAvailabilityBlackouts = (
  healthUnitId: string | undefined,
  options?: Omit<
    UseQueryOptions<IExamAvailabilityBlackout[]>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: [GET_EXAM_AVAILABILITY_BLACKOUTS_KEY, healthUnitId],
    queryFn: () => getExamAvailabilityBlackouts(healthUnitId!),
    enabled: Boolean(healthUnitId),
    ...options,
  });
};
