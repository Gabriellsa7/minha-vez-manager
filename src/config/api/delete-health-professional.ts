import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import { withInvalidation } from '../../services/react-query';
import { GET_HEALTH_PROFESSIONALS_BY_USER_ID } from './get-health-professionals-by-user-id';
import { GET_HEALTH_PROFESSIONALS_KEY } from './get-health-professionals';

const deleteHealthProfessional = async (id: string): Promise<void> => {
  await apiClient.delete(`/health-professionals/${id}`);
};

export const useDeleteHealthProfessional = (
  options?: UseMutationOptions<void, unknown, string>
) =>
  useMutation({
    mutationFn: deleteHealthProfessional,
    ...withInvalidation(
      [GET_HEALTH_PROFESSIONALS_BY_USER_ID, GET_HEALTH_PROFESSIONALS_KEY],
      options
    ),
  });
