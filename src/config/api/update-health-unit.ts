import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IHealthUnit } from '../entities/health-unit/health-unit.entity';

export interface UpdateHealthUnitParams {
  id: string;
  data: Partial<
    Pick<
      IHealthUnit,
      'name' | 'phone' | 'email' | 'description' | 'img' | 'address'
    >
  >;
}

const updateHealthUnit = async ({
  id,
  data,
}: UpdateHealthUnitParams): Promise<IHealthUnit> => {
  const path = `/health-units/${id}`;

  const response = await apiClient.put<IHealthUnit>(path, data);

  return response.data;
};

export const useUpdateHealthUnit = (
  options?: UseMutationOptions<IHealthUnit, unknown, UpdateHealthUnitParams>
) =>
  useMutation({
    mutationFn: updateHealthUnit,
    ...options,
  });
