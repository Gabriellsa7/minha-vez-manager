export interface IQueueItem {
  _id: string;
  queueId: string;
  patientId: string;
  code: string;
  position: number;
  priority: EQueueItemPriority;
  status: EQueueItemStatus;
  checkInTime?: Date;
  calledAt?: Date;
  finishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export const QueueItemPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
} as const;

export const QueueItemStatus = {
  WAITING: 'WAITING',
  IN_SERVICE: 'IN_SERVICE',
  FINISHED: 'FINISHED',
} as const;

export type EQueueItemPriority =
  (typeof QueueItemPriority)[keyof typeof QueueItemPriority];
export type EQueueItemStatus =
  (typeof QueueItemStatus)[keyof typeof QueueItemStatus];
