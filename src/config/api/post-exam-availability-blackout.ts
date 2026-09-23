import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IExamAvailabilityBlackout } from '../entities/exam-availability/exam-availability.entity';
import { withInvalidation } from '../../services/react-query';
import { GET_EXAM_AVAILABILITY_BLACKOUTS_KEY } from './get-exam-availability-blackouts';
import { GET_EXAM_SLOTS_KEY } from './get-exam-slots';

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
    ...withInvalidation(
      [GET_EXAM_AVAILABILITY_BLACKOUTS_KEY, GET_EXAM_SLOTS_KEY],
      options
    ),
  });
