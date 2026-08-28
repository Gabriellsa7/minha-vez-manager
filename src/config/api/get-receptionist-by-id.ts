import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IReceptionist } from '../entities/receptionist/receptionist.entity';

export const GET_RECEPTIONIST_BY_ID_KEY = 'GET_RECEPTIONIST_BY_ID_KEY';

const getReceptionistById = async (id: string): Promise<IReceptionist> => {
  const path = `/receptionists/${id}`;

  const response = await apiClient.get<IReceptionist>(path);

  return response.data;
};

export const useReceptionistById = (
  id: string | undefined,
  options?: Omit<UseQueryOptions<IReceptionist>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [GET_RECEPTIONIST_BY_ID_KEY, id],
    queryFn: () => getReceptionistById(id!),
    enabled: Boolean(id),
    ...options,
  });
};
