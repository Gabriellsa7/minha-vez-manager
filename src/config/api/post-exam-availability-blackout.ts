import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IExamAvailabilityBlackout } from '../entities/exam-availability/exam-availability.entity';

export interface PostExamAvailabilityBlackoutParams {
  healthUnitId: string;
  date: string;
  reason?: string;
}

const postExamAvailabilityBlackout = async (
  params: PostExamAvailabilityBlackoutParams
): Promise<IExamAvailabilityBlackout> => {
  const { data } = await apiClient.post<IExamAvailabilityBlackout>(
    `/health-units/${params.healthUnitId}/exam-availability-blackouts`,
    { date: params.date, reason: params.reason }
  );

  return data;
};

export const usePostExamAvailabilityBlackout = (
  options?: UseMutationOptions<
    IExamAvailabilityBlackout,
    unknown,
    PostExamAvailabilityBlackoutParams
  >
) =>
  useMutation({
    mutationFn: postExamAvailabilityBlackout,
    ...options,
  });
