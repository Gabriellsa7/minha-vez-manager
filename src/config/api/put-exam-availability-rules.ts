import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IExamAvailabilityRule } from '../entities/exam-availability/exam-availability.entity';

export interface PutExamAvailabilityRulesParams {
  healthUnitId: string;
  rules: Omit<IExamAvailabilityRule, '_id' | 'healthUnitId'>[];
}

const putExamAvailabilityRules = async (
  params: PutExamAvailabilityRulesParams
): Promise<IExamAvailabilityRule[]> => {
  const { data } = await apiClient.put<IExamAvailabilityRule[]>(
    `/health-units/${params.healthUnitId}/exam-availability-rules`,
    { rules: params.rules }
  );

  return data;
};

export const usePutExamAvailabilityRules = (
  options?: UseMutationOptions<
    IExamAvailabilityRule[],
    unknown,
    PutExamAvailabilityRulesParams
  >
) =>
  useMutation({
    mutationFn: putExamAvailabilityRules,
    ...options,
  });
