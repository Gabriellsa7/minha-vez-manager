import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';

const deleteReceptionist = async (id: string): Promise<void> => {
  await apiClient.delete(`/receptionists/${id}`);
};

export const useDeleteReceptionist = (
  options?: UseMutationOptions<void, unknown, string>
) =>
  useMutation({
    mutationFn: deleteReceptionist,
    ...options,
  });
