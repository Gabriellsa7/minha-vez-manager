import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import { withInvalidation } from '../../services/react-query';
import { GET_RECEPTIONISTS_BY_HEALTH_UNIT_ID_KEY } from './get-receptionists-by-health-unit-id';

const deleteReceptionist = async (id: string): Promise<void> => {
  await apiClient.delete(`/receptionists/${id}`);
};

export const useDeleteReceptionist = (
  options?: UseMutationOptions<void, unknown, string>
) =>
  useMutation({
    mutationFn: deleteReceptionist,
    ...withInvalidation([GET_RECEPTIONISTS_BY_HEALTH_UNIT_ID_KEY], options),
  });
