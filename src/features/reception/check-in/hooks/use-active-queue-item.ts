import { useGetQueueItemByPatientId } from '../../../../config/api/get-queue-item-by-patient-id';
import {
  QueueItemStatus,
  type IQueueItem,
} from '../../../../config/entities/queue-item/queue-item.entity';

const ACTIVE_STATUSES: string[] = [
  QueueItemStatus.WAITING,
  QueueItemStatus.IN_SERVICE,
];

const pickMostRecentActive = (items: IQueueItem[] = []) =>
  items
    .filter((item) => ACTIVE_STATUSES.includes(item.status))
    .sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime()
    )[0];

export function useActiveQueueItem(patientId?: string) {
  const { data: queueItems, isLoading } = useGetQueueItemByPatientId(patientId);

  return {
    activeQueueItem: pickMostRecentActive(queueItems),
    isLoading,
  };
}
