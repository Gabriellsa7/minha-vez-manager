import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IAppointment } from '../entities/appointments/appointment.entity';

export const GET_APPOINTMENTS_BY_PROFESSIONAL_ID_KEY =
  'GET_APPOINTMENTS_BY_PROFESSIONAL_ID_KEY';

const getAppointmentsByProfessionalId = async (
  professionalId: string
): Promise<IAppointment[]> => {
  const path = `/health-professionals/${professionalId}/appointments`;

  const response = await apiClient.get<IAppointment[]>(path);

  return response.data;
};

export const useGetAppointmentsByProfessionalId = (
  professionalId: string | undefined,
  options?: Omit<UseQueryOptions<IAppointment[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [GET_APPOINTMENTS_BY_PROFESSIONAL_ID_KEY, professionalId],
    queryFn: () => getAppointmentsByProfessionalId(professionalId!),
    enabled: Boolean(professionalId),
    ...options,
  });
};
