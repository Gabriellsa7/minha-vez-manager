import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IExamWithFileUrl } from '../entities/exam/exam.entity';

export const GET_EXAM_BY_ID_KEY = 'GET_EXAM_BY_ID_KEY';

const getExamById = async (id: string): Promise<IExamWithFileUrl> => {
  const path = `/exams/${id}`;

  const response = await apiClient.get<IExamWithFileUrl>(path);

  return response.data;
};

export const useGetExamById = (
  id: string | undefined,
  options?: Omit<UseQueryOptions<IExamWithFileUrl>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [GET_EXAM_BY_ID_KEY, id],
    queryFn: () => getExamById(id!),
    enabled: Boolean(id),
    ...options,
  });
};
