import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../../../../services/axios';
import type {
  EHealthUnitType,
  IHealthUnit,
  IService,
} from '../../../../../config/entities/health-unit/health-unit.entity';

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
    ...options,
  });
