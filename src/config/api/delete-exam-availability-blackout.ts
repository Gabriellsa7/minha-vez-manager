import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';

const deleteExamAvailabilityBlackout = async (id: string): Promise<void> => {
  await apiClient.delete(`/exam-availability-blackouts/${id}`);
};

export const useDeleteExamAvailabilityBlackout = (
  options?: UseMutationOptions<void, unknown, string>
) =>
  useMutation({
    mutationFn: deleteExamAvailabilityBlackout,
    ...options,
  });
