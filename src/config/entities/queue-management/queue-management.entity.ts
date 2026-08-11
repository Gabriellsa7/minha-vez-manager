import type { IPatient } from '../patient/patient.entity';
import type { IQueue } from '../queue/queue.entity';
import type { IQueueItem } from '../queue-item/queue-item.entity';
import type { IUser } from '../user/user.entity';

export interface IQueueManagement {
  queue: IQueue;
  currentItem: IQueueManagementItem | null;
  items: IQueueManagementItem[];
  nextQueueItemId: string | null;
}

export interface IQueueManagementItem {
  queueItem: IQueueItem;
  patient: IPatient;
  user: IUser;
}
