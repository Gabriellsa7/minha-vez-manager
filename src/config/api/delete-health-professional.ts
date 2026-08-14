import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';

const deleteHealthProfessional = async (id: string): Promise<void> => {
  await apiClient.delete(`/health-professionals/${id}`);
};

export const useDeleteHealthProfessional = (
  options?: UseMutationOptions<void, unknown, string>
) =>
  useMutation({
    mutationFn: deleteHealthProfessional,
    ...options,
  });
