import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IExamOffering } from '../entities/exam-offering/exam-offering.entity';

export const GET_EXAM_OFFERINGS_BY_HEALTH_UNIT_ID_KEY =
  'GET_EXAM_OFFERINGS_BY_HEALTH_UNIT_ID_KEY';

const getExamOfferingsByHealthUnitId = async (
  healthUnitId: string,
  includeInactive: boolean
): Promise<IExamOffering[]> => {
  const path = `/health-units/${healthUnitId}/exam-offerings`;

  const response = await apiClient.get<IExamOffering[]>(path, {
    params: includeInactive ? { includeInactive: true } : undefined,
  });

  return response.data;
};

export const useGetExamOfferingsByHealthUnitId = (
  healthUnitId: string | undefined,
  includeInactive = true,
  options?: Omit<UseQueryOptions<IExamOffering[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [
      GET_EXAM_OFFERINGS_BY_HEALTH_UNIT_ID_KEY,
      healthUnitId,
      includeInactive,
    ],
    queryFn: () => getExamOfferingsByHealthUnitId(healthUnitId!, includeInactive),
    enabled: Boolean(healthUnitId),
    ...options,
  });
};
