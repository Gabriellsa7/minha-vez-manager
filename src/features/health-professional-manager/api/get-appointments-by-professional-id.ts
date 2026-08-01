import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { IAppointment } from '../../../config/entities/appointments/appointment.entity';
import { apiClient } from '../../../services/axios';

export const GET_APPOINTMENTS_BY_PROFESSIONAL_ID_KEY =
  'GET_APPOINTMENTS_BY_PROFESSIONAL_ID_KEY';

export interface IAppointmentsByProfessionalIdParams {
  professionalId: string;
}

const getAppointmentsByProfessionalId = async (
  params: IAppointmentsByProfessionalIdParams
): Promise<IAppointment[]> => {
  const response = await apiClient.get(
    `/health-professionals/${params.professionalId}/appointments`
  );

  return response.data;
};

export const useGetAppointmentsByProfessionalId = (
  professionalId?: string,
  options?: Omit<UseQueryOptions<IAppointment[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [GET_APPOINTMENTS_BY_PROFESSIONAL_ID_KEY, professionalId],
    queryFn: () =>
      getAppointmentsByProfessionalId({
        professionalId: professionalId!,
      }),
    enabled: Boolean(professionalId),
    ...options,
  });
};
