export interface IAppointment {
  _id: string;
  patientId: string;
  professionalId: string;
  healthUnitId: string;
  queueItemId?: string | null;
  dateTime: Date;
  status: EAppointmentStatus;
  notes?: string;
  checkInAt?: Date | null;
  finishedAt?: Date | null;
  isReturn: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const appointmentsStatus = {
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELED: 'CANCELED',
  QUEUE_CLOSED: 'QUEUE_CLOSED',
} as const;

export type EAppointmentStatus =
  (typeof appointmentsStatus)[keyof typeof appointmentsStatus];
