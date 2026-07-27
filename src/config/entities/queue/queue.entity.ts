export interface IQueue {
  _id: string;
  professionalId: string;
  healthUnitId: string;
  status: EQueueStatus;
  queueDate: Date;
  openedAt?: Date | null;
  closedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export const queueStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  CLOSED: 'CLOSED',
} as const;

export type EQueueStatus = (typeof queueStatus)[keyof typeof queueStatus];
