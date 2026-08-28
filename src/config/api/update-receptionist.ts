import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IReceptionist } from '../entities/receptionist/receptionist.entity';

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
    ...options,
  });
