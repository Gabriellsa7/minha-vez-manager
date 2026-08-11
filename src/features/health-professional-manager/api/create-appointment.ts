import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../../services/axios';
import type { IAppointment } from '../../../config/entities/appointments/appointment.entity';

export interface CreateAppointmentParams {
  patientId: string;
  professionalId: string;
  healthUnitId: string;
  dateTime: string;
  notes?: string;
  isReturn?: boolean;
  originQueueItemId?: string;
}

const createAppointment = async (
  params: CreateAppointmentParams
): Promise<IAppointment> => {
  const { data } = await apiClient.post<IAppointment>(
    '/appointments',
    params
  );

  return data;
};

export const useCreateAppointment = (
  options?: UseMutationOptions<IAppointment, unknown, CreateAppointmentParams>
) =>
  useMutation({
    mutationFn: createAppointment,
    ...options,
  });
