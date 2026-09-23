import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import { withInvalidation } from '../../services/react-query';
import { GET_EXAM_AVAILABILITY_BLACKOUTS_KEY } from './get-exam-availability-blackouts';
import { GET_EXAM_SLOTS_KEY } from './get-exam-slots';

const deleteExamAvailabilityBlackout = async (id: string): Promise<void> => {
  await apiClient.delete(`/exam-availability-blackouts/${id}`);
};

export const useDeleteExamAvailabilityBlackout = (
  options?: UseMutationOptions<void, unknown, string>
) =>
  useMutation({
    mutationFn: deleteExamAvailabilityBlackout,
    ...withInvalidation(
      [GET_EXAM_AVAILABILITY_BLACKOUTS_KEY, GET_EXAM_SLOTS_KEY],
      options
    ),
  });
