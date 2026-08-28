import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';

const deleteUser = async (id: string): Promise<void> => {
  await apiClient.delete(`/users/${id}`);
};

export const useDeleteUser = (
  options?: UseMutationOptions<void, unknown, string>
) =>
  useMutation({
    mutationFn: deleteUser,
    ...options,
  });
