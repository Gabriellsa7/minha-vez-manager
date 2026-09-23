import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IHealthUnit } from '../entities/health-unit/health-unit.entity';
import { withInvalidation } from '../../services/react-query';
import { GET_HEALTH_UNITS_BY_USER_ID_KEY } from './get-health-units-by-user-id';
import { GET_HEALTH_UNIT_BY_ID_KEY } from './get-health-unit-by-id';

export interface UpdateHealthUnitParams {
  id: string;
  data: Partial<
    Pick<
      IHealthUnit,
      | 'name'
      | 'phone'
      | 'email'
      | 'description'
      | 'img'
      | 'address'
      | 'openingHours'
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
    ...withInvalidation(
      [GET_HEALTH_UNITS_BY_USER_ID_KEY, GET_HEALTH_UNIT_BY_ID_KEY],
      options
    ),
  });
