import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';

export const GET_AVAILABLE_SLOTS_KEY = 'GET_AVAILABLE_SLOTS_KEY';

export interface IAvailableSlot {
  time: string;
  dateTime: string;
}

interface IGetAvailableSlotsParams {
  professionalId: string | undefined;
  date: string | undefined;
  shift?: 'MORNING' | 'AFTERNOON';
}

const getAvailableSlots = async (
  professionalId: string,
  date: string,
  shift?: 'MORNING' | 'AFTERNOON'
): Promise<IAvailableSlot[]> => {
  const path = `/health-professionals/${professionalId}/available-slots`;

  const response = await apiClient.get<IAvailableSlot[]>(path, {
    params: { date, shift },
  });

  return response.data;
};

export const useGetAvailableSlots = (
  { professionalId, date, shift }: IGetAvailableSlotsParams,
  options?: Omit<UseQueryOptions<IAvailableSlot[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [GET_AVAILABLE_SLOTS_KEY, professionalId, date, shift],
    queryFn: () => getAvailableSlots(professionalId!, date!, shift),
    enabled: Boolean(professionalId) && Boolean(date),
    ...options,
  });
};
