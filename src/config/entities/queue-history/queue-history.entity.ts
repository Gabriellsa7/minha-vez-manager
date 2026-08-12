import type { IPatient } from '../patient/patient.entity';
import type { IQueueItem } from '../queue-item/queue-item.entity';
import type { EQueueShift } from '../queue/queue.entity';
import type { IUser } from '../user/user.entity';

export interface IQueueHistoryEntry {
  queueItem: IQueueItem;
  patient: IPatient;
  user: IUser;
  queueDate: string;
  shift: EQueueShift;
}
