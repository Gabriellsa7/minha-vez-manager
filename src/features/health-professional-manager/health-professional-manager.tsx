import { useState } from 'react';
import { ListX } from 'lucide-react';
import { CloseQueueReasonModal } from '../../components/close-queue-reason-modal/close-queue-reason-modal';
import { EmptyState } from '../../components/empty-state/empty-state';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { useCurrentUser } from '../../config/api/get-current-user';
import { useHealthProfessionalById } from '../../config/api/get-health-professional-by-id';
import { queueStatus } from '../../config/entities/queue/queue.entity';
import { useGetPrescriptionsByPatientId } from '../health-professional-prescription/api/get-prescriptions-by-patient-id';
import { PrescriptionModal } from '../health-professional-prescription/components/prescription-modal/prescription-modal';
import { AwaitingQueueCard } from './components/awating-queue-card/awating-queue-card';
import { MarkReturnModal } from './components/mark-return-modal/mark-return-modal';
import { NowQueueCard } from './components/now-queue-card/now-queue-card';
import { QueueListCard } from './components/queue-list-card/queue-list-card';
import style from './health-professional-manager.module.scss';
import { useQueueManagement } from './hooks/use-queue-management';
import { hasShiftStarted, isSameDay } from './utils/queue-schedule';

function HealthProfessionalManager() {
  const [isMarkReturnModalOpen, setMarkReturnModalOpen] = useState(false);
  const [isPrescriptionModalOpen, setPrescriptionModalOpen] = useState(false);

  const { data: user } = useCurrentUser();
  const { data: professional } = useHealthProfessionalById(user?._id);
  const queue = useQueueManagement(user?._id);

  const currentItem = queue.queueManagement?.currentItem;

  const { data: currentPatientPrescriptions } = useGetPrescriptionsByPatientId(
    currentItem?.patient._id
  );
  const hasPrescriptionForCurrentItem = Boolean(
    currentItem &&
    currentPatientPrescriptions?.some(
      (prescription) => prescription.queueItemId === currentItem.queueItem._id
    )
  );

  const today = new Date();
  const hasOpenQueue = Boolean(queue.queueManagement?.queue);

  return (
    <>
      <div className={style.mainContent}>
        <HeaderManager
          title="Painel de Gestão"
          subtitle="Abra sua fila do dia e chame os pacientes em ordem de atendimento"
          user={user}
        />
        <div className={style.queueContainer}>
          {queue.activeQueues.length
            ? queue.activeQueues.map((item) => {
                const isActive =
                  item.status === queueStatus.OPEN ||
                  item.status === queueStatus.IN_PROGRESS;

                return (
                  <div key={item._id} className={style.queueEntry}>
                    <QueueListCard
                      queue={item}
                      isToday={isSameDay(item.queueDate, today)}
                      hasShiftStarted={hasShiftStarted(item.shift, today)}
                      isActive={isActive}
                      isBlocked={hasOpenQueue && !isActive}
                      onOpen={queue.openQueue}
                      onClose={queue.requestCloseQueue}
                      isOpening={queue.openingQueueId === item._id}
                      isClosing={queue.closingQueueId === item._id}
                    />

                    {isActive && queue.queueManagement && (
                      <div className={style.queueDetails}>
                        {currentItem && (
                          <NowQueueCard
                            queue={queue.queueManagement.queue}
                            currentItem={currentItem}
                            hasPrescription={hasPrescriptionForCurrentItem}
                            onFinish={queue.finishCurrentItem}
                            onAbsent={queue.markCurrentItemAbsent}
                            onMarkReturn={() => setMarkReturnModalOpen(true)}
                            onPrescribe={() => setPrescriptionModalOpen(true)}
                          />
                        )}
                        <AwaitingQueueCard
                          onCall={queue.callQueueItem}
                          queueManagement={queue.queueManagement}
                        />
                      </div>
                    )}
                  </div>
                );
              })
            : !queue.isLoading && (
                <EmptyState
                  icon={ListX}
                  title="Nenhuma fila disponível"
                  description="Suas filas aparecem aqui quando houver consultas agendadas para você."
                />
              )}
        </div>
      </div>

      {isMarkReturnModalOpen && currentItem && (
        <MarkReturnModal
          onClose={() => setMarkReturnModalOpen(false)}
          professional={professional}
          patientId={currentItem.patient._id}
          patientName={currentItem.user.name}
          originQueueItemId={currentItem.queueItem._id}
        />
      )}

      {isPrescriptionModalOpen && currentItem && professional && (
        <PrescriptionModal
          onClose={() => setPrescriptionModalOpen(false)}
          professional={professional}
          patientId={currentItem.patient._id}
          patientName={currentItem.user.name}
          queueItemId={currentItem.queueItem._id}
        />
      )}

      {queue.closeReasonQueueId && (
        <CloseQueueReasonModal
          isClosing={queue.isClosingQueue}
          onCancel={queue.cancelCloseWithReason}
          onConfirm={queue.confirmCloseWithReason}
        />
      )}
    </>
  );
}

export { HealthProfessionalManager };
