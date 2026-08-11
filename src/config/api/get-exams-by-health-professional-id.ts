import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IExam } from '../entities/exam/exam.entity';

export const GET_EXAMS_BY_HEALTH_PROFESSIONAL_ID_KEY =
  'GET_EXAMS_BY_HEALTH_PROFESSIONAL_ID_KEY';

const getExamsByHealthProfessionalId = async (
  professionalId: string
): Promise<IExam[]> => {
  const path = `/health-professionals/${professionalId}/exams`;

  const response = await apiClient.get<IExam[]>(path);

  return response.data;
};

export const useGetExamsByHealthProfessionalId = (
  professionalId: string | undefined,
  options?: Omit<UseQueryOptions<IExam[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [GET_EXAMS_BY_HEALTH_PROFESSIONAL_ID_KEY, professionalId],
    queryFn: () => getExamsByHealthProfessionalId(professionalId!),
    enabled: Boolean(professionalId),
    ...options,
  });
};
