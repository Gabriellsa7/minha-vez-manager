import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import { withInvalidation } from '../../services/react-query';
import { GET_HEALTH_UNITS_BY_USER_ID_KEY } from './get-health-units-by-user-id';

const deleteHealthUnit = async (id: string): Promise<void> => {
  await apiClient.delete(`/health-units/${id}`);
};

export const useDeleteHealthUnit = (
  options?: UseMutationOptions<void, unknown, string>
) =>
  useMutation({
    mutationFn: deleteHealthUnit,
    ...withInvalidation([GET_HEALTH_UNITS_BY_USER_ID_KEY], options),
  });
