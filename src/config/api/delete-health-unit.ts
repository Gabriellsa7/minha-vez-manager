import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';

const deleteHealthUnit = async (id: string): Promise<void> => {
  await apiClient.delete(`/health-units/${id}`);
};

export const useDeleteHealthUnit = (
  options?: UseMutationOptions<void, unknown, string>
) =>
  useMutation({
    mutationFn: deleteHealthUnit,
    ...options,
  });
