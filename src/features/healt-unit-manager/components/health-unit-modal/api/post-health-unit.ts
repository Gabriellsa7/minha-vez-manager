import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../../../../services/axios';
import type {
  EHealthUnitType,
  IHealthUnit,
  IService,
} from '../../../../../config/entities/health-unit/health-unit.entity';
import { withInvalidation } from '../../../../../services/react-query';
import { GET_HEALTH_UNITS_BY_USER_ID_KEY } from '../../../../../config/api/get-health-units-by-user-id';

export interface CreateHealthUnitParams {
  userId: string;
  name: string;
  phone: string;
  email: string;
  description?: string;
  img?: string;
  unitType: EHealthUnitType;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  services: Array<Omit<IService, '_id' | 'createdAt' | 'updatedAt'>>;
}

const postHealthUnit = async (
  params: CreateHealthUnitParams
): Promise<IHealthUnit> => {
  const { data } = await apiClient.post<IHealthUnit>('/health-units', params);

  return data;
};

export const usePostHealthUnit = (
  options?: UseMutationOptions<IHealthUnit, unknown, CreateHealthUnitParams>
) =>
  useMutation({
    mutationFn: postHealthUnit,
    ...withInvalidation([GET_HEALTH_UNITS_BY_USER_ID_KEY], options),
  });
