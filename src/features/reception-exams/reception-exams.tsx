import { useState } from 'react';
import { Clock3, CalendarCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import { SideBar } from '../../components/side-bar/side-bar-manager';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { useCurrentUser } from '../../config/api/get-current-user';
import { useGetExamOfferingsByHealthUnitId } from '../../config/api/get-exam-offerings-by-health-unit-id';
import { useGetExamSlots } from '../../config/api/get-exam-slots';
import { usePostExamBooking } from '../../config/api/post-exam-booking';
import { getDateKey } from '../../config/utils';
import { getExamDateTimeFromDateAndTime } from '../../config/utils/patient-input';
import { handleApiError } from '../../config/utils/handle-api-error';
import { usePatientLookup } from '../reception-patient-lookup/hooks/use-patient-lookup';
import { PatientLookupPanel } from '../reception-patient-lookup/patient-lookup-panel';
import { SIDEBAR_RECEPTION_ITEMS } from '../reception-appointments/constants';
import style from './reception-exams.module.scss';

function ReceptionExams() {
  const { data: user } = useCurrentUser();
  const healthUnitId = user?.healthUnitId;

  const { data: examOfferings } = useGetExamOfferingsByHealthUnitId(
    healthUnitId,
    false
  );

  const [selectedOfferingId, setSelectedOfferingId] = useState('');
  const [selectedDate, setSelectedDate] = useState(() =>
    getDateKey(new Date())
  );
  const [selectedTime, setSelectedTime] = useState('');

  const offeringId = selectedOfferingId || examOfferings?.[0]?._id || '';

  const selectedOffering = examOfferings?.find(
    (offering) => offering._id === offeringId
  );

  const { data: slotsResponse } = useGetExamSlots(healthUnitId, selectedDate);

  // Exam slot times are UTC-encoded wall-clock values (see
  // getExamDateTimeFromDateAndTime) — "now" must be re-anchored the same way
  // before comparing, otherwise the browser's timezone offset makes today's
  // slots look past/future at the wrong moment.
  const now = new Date();
  const comparableNow = new Date(
    Date.UTC(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes()
    )
  );

  // Rather than clearing `selectedTime` via an effect whenever the offering
  // or date changes, treat a selection that's no longer in the freshly
  // fetched slot list as unselected.
  const availableSlotTimes = slotsResponse?.slots.map((slot) => slot.time) ?? [];
  const effectiveSelectedTime = availableSlotTimes.includes(selectedTime)
    ? selectedTime
    : '';

  const lookup = usePatientLookup();
  const { mutate: createExamBooking, isPending } = usePostExamBooking();

  const handleConfirm = () => {
    if (
      !lookup.patient ||
      !selectedOffering ||
      !selectedDate ||
      !effectiveSelectedTime
    ) {
      return;
    }

    const scheduledAt = getExamDateTimeFromDateAndTime(
      selectedDate,
      effectiveSelectedTime
    );

    createExamBooking(
      {
        patientId: lookup.patient._id,
        healthUnitId: selectedOffering.healthUnitId,
        examOfferingId: selectedOffering._id,
        scheduledAt: scheduledAt.toISOString(),
        notes: 'Agendamento realizado pela recepção',
      },
      {
        onSuccess: () => {
          toast.success('Exame marcado com sucesso.');
          setSelectedTime('');
          lookup.reset();
        },
        onError: handleApiError,
      }
    );
  };

  const canConfirm = Boolean(
    lookup.patient && selectedOffering && selectedDate && effectiveSelectedTime
  );

  return (
    <div className={style.container}>
      <SideBar
        items={SIDEBAR_RECEPTION_ITEMS}
        pageTitle="Painel de Recepção"
        user={user}
      />
      <div className={style.mainContent}>
        <HeaderManager
          title="Marcar Exame"
          subtitle="Busque o paciente pelo CPF e marque o exame na fila do app"
          onButtonClick={() => {}}
          user={user}
        />

        <PatientLookupPanel lookup={lookup} />

        <div
          className={`${style.card} ${!lookup.patient ? style.disabled : ''}`}
        >
          <label className={style.field}>
            <span>Exame</span>
            <select
              value={offeringId}
              onChange={(event) => setSelectedOfferingId(event.target.value)}
            >
              <option value="">Selecione um exame</option>
              {examOfferings?.map((offering) => (
                <option key={offering._id} value={offering._id}>
                  {offering.name}
                </option>
              ))}
            </select>
          </label>

          {selectedOffering && (
            <div className={style.offeringInfo}>
              <span>{selectedOffering.durationMinutes} min</span>
              {selectedOffering.requiresFasting && (
                <span>
                  Jejum
                  {selectedOffering.fastingHours
                    ? ` de ${selectedOffering.fastingHours}h`
                    : ''}
                </span>
              )}
              {selectedOffering.requiresPreparation &&
                selectedOffering.preparationInstructions && (
                  <span>Preparo: {selectedOffering.preparationInstructions}</span>
                )}
            </div>
          )}

          <label className={style.field}>
            <span>Data</span>
            <input
              type="date"
              value={selectedDate}
              min={getDateKey(new Date())}
              onChange={(event) => setSelectedDate(event.target.value)}
            />
          </label>

          <h3 className={style.sectionTitle}>Horários disponíveis</h3>
          {!slotsResponse?.slots.length ? (
            <p className={style.empty}>
              Nenhum horário disponível para esse exame nesse dia.
            </p>
          ) : (
            <div className={style.timesGrid}>
              {slotsResponse.slots.map((slot) => {
                const isPast =
                  getExamDateTimeFromDateAndTime(selectedDate, slot.time) <=
                  comparableNow;
                const isFull = slot.remainingCapacity <= 0;
                const isUnavailable = isPast || isFull;
                const isSelected = effectiveSelectedTime === slot.time;

                return (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={isUnavailable}
                    onClick={() => setSelectedTime(slot.time)}
                    className={`${style.timeSlot} ${
                      isSelected ? style.timeSlotSelected : ''
                    }`}
                  >
                    <Clock3 size={14} />
                    {slot.time}
                    {isFull && ' (lotado)'}
                  </button>
                );
              })}
            </div>
          )}

          <button
            type="button"
            className={style.confirmButton}
            disabled={!canConfirm || isPending}
            onClick={handleConfirm}
          >
            <CalendarCheck
              size={16}
              style={{ marginRight: 8, verticalAlign: 'text-bottom' }}
            />
            {isPending ? 'Marcando...' : 'Confirmar exame'}
          </button>
        </div>
      </div>
    </div>
  );
}

export { ReceptionExams };
