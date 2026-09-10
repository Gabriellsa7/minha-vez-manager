import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Clock3, UserRoundCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import { SideBar } from '../../components/side-bar/side-bar-manager';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { useCurrentUser } from '../../config/api/get-current-user';
import {
  GET_QUEUE_ITEM_BY_PATIENT_ID,
  useGetQueueItemByPatientId,
} from '../../config/api/get-queue-item-by-patient-id';
import { useCheckInQueueItem } from '../../config/api/check-in-queue-item';
import { QueueItemStatus } from '../../config/entities/queue-item/queue-item.entity';
import { formatTime } from '../../config/utils';
import { handleApiError } from '../../config/utils/handle-api-error';
import { usePatientLookup } from '../reception-patient-lookup/hooks/use-patient-lookup';
import { PatientLookupPanel } from '../reception-patient-lookup/patient-lookup-panel';
import { SIDEBAR_RECEPTION_ITEMS } from '../reception-appointments/constants';
import style from './reception-check-in.module.scss';

function ReceptionCheckIn() {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();

  const lookup = usePatientLookup();
  const patientId = lookup.patient?._id;

  const { data: queueItems, isFetching: isLoadingQueueItems } =
    useGetQueueItemByPatientId(patientId);

  const activeQueueItem = [...(queueItems ?? [])]
    .filter(
      (item) =>
        item.status === QueueItemStatus.WAITING ||
        item.status === QueueItemStatus.IN_SERVICE
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime()
    )[0];

  const { mutate: checkIn, isPending } = useCheckInQueueItem();

  const handleCheckIn = () => {
    if (!activeQueueItem) return;

    checkIn(activeQueueItem._id, {
      onSuccess: () => {
        toast.success('Check-in confirmado com sucesso.');
        queryClient.invalidateQueries({
          queryKey: [GET_QUEUE_ITEM_BY_PATIENT_ID, patientId],
        });
      },
      onError: handleApiError,
    });
  };

  return (
    <div className={style.container}>
      <SideBar
        items={SIDEBAR_RECEPTION_ITEMS}
        pageTitle="Painel de Recepção"
        user={user}
      />
      <div className={style.mainContent}>
        <HeaderManager
          title="Check-in de Pacientes"
          subtitle="Busque o paciente pelo CPF e confirme a presença dele na unidade"
          onButtonClick={() => {}}
          user={user}
        />

        <PatientLookupPanel lookup={lookup} />

        {patientId && (
          <div className={style.card}>
            {isLoadingQueueItems && (
              <p className={style.empty}>Buscando atendimento do dia...</p>
            )}

            {!isLoadingQueueItems && !activeQueueItem && (
              <p className={style.empty}>
                Nenhuma consulta em andamento encontrada para esse paciente
                hoje.
              </p>
            )}

            {activeQueueItem?.status === QueueItemStatus.IN_SERVICE && (
              <div className={style.statusRow}>
                <UserRoundCheck size={18} />
                <span>Paciente já está em atendimento.</span>
              </div>
            )}

            {activeQueueItem?.status === QueueItemStatus.WAITING && (
              <>
                <div className={style.queueInfo}>
                  <span>Senha</span>
                  <strong>#{activeQueueItem.code}</strong>
                </div>

                {activeQueueItem.checkInTime ? (
                  <div className={`${style.statusRow} ${style.confirmed}`}>
                    <CheckCircle2 size={18} />
                    <span>
                      Check-in confirmado às{' '}
                      {formatTime(activeQueueItem.checkInTime)}
                    </span>
                  </div>
                ) : (
                  <>
                    <div className={`${style.statusRow} ${style.pending}`}>
                      <Clock3 size={18} />
                      <span>Check-in ainda não realizado.</span>
                    </div>
                    <button
                      type="button"
                      className={style.confirmButton}
                      disabled={isPending}
                      onClick={handleCheckIn}
                    >
                      {isPending ? 'Confirmando...' : 'Confirmar check-in'}
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export { ReceptionCheckIn };
