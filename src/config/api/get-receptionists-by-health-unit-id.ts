import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IReceptionist } from '../entities/receptionist/receptionist.entity';

export const GET_RECEPTIONISTS_BY_HEALTH_UNIT_ID_KEY =
  'GET_RECEPTIONISTS_BY_HEALTH_UNIT_ID_KEY';

export type GetReceptionistsByHealthUnitIdResponse = IReceptionist[];

const getReceptionistsByHealthUnitId = async (
  healthUnitId: string
): Promise<GetReceptionistsByHealthUnitIdResponse> => {
  const path = `/receptionists/health-unit/${healthUnitId}`;

  const response =
    await apiClient.get<GetReceptionistsByHealthUnitIdResponse>(path);

  return response.data;
};

export const useReceptionistsByHealthUnitId = (
  healthUnitId: string | undefined,
  options?: Omit<
    UseQueryOptions<GetReceptionistsByHealthUnitIdResponse>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: [GET_RECEPTIONISTS_BY_HEALTH_UNIT_ID_KEY, healthUnitId],
    queryFn: () => getReceptionistsByHealthUnitId(healthUnitId!),
    enabled: Boolean(healthUnitId),
    ...options,
  });
};
