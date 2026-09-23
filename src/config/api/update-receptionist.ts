import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IReceptionist } from '../entities/receptionist/receptionist.entity';
import { withInvalidation } from '../../services/react-query';
import { GET_RECEPTIONISTS_BY_HEALTH_UNIT_ID_KEY } from './get-receptionists-by-health-unit-id';
import { GET_RECEPTIONIST_BY_ID_KEY } from './get-receptionist-by-id';

export interface UpdateReceptionistParams {
  id: string;
  data: Partial<Pick<IReceptionist, 'name' | 'email' | 'active'>>;
}

const updateReceptionist = async ({
  id,
  data,
}: UpdateReceptionistParams): Promise<IReceptionist> => {
  const path = `/receptionists/${id}`;

  const response = await apiClient.put<IReceptionist>(path, data);

  return response.data;
};

export const useUpdateReceptionist = (
  options?: UseMutationOptions<IReceptionist, unknown, UpdateReceptionistParams>
) =>
  useMutation({
    mutationFn: updateReceptionist,
    ...withInvalidation(
      [GET_RECEPTIONISTS_BY_HEALTH_UNIT_ID_KEY, GET_RECEPTIONIST_BY_ID_KEY],
      options
    ),
  });
