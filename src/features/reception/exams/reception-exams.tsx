import { DatePicker } from '../../../components/date-picker/date-picker';
import { HeaderManager } from '../../../components/header-manager/header-manager';
import { Select } from '../../../components/select/select';
import { useCurrentUser } from '../../../config/api/get-current-user';
import type { IExamOffering } from '../../../config/entities/exam-offering/exam-offering.entity';
import { BookingCard } from '../components/booking-card/booking-card';
import { usePatientLookup } from '../components/patient-lookup/hooks/use-patient-lookup';
import { PatientLookup } from '../components/patient-lookup/patient-lookup';
import { SlotPicker } from '../components/slot-picker/slot-picker';
import style from '../reception.module.scss';
import { useExamBooking } from './hooks/use-exam-booking';

function ExamOfferingDetails({ offering }: { offering: IExamOffering }) {
  return (
    <div className={style.details}>
      <span className={style.detailChip}>{offering.durationMinutes} min</span>
      {offering.requiresFasting && (
        <span className={style.detailChip}>
          Jejum
          {offering.fastingHours ? ` de ${offering.fastingHours}h` : ''}
        </span>
      )}
      {offering.requiresPreparation && offering.preparationInstructions && (
        <span className={style.detailChip}>
          Preparo: {offering.preparationInstructions}
        </span>
      )}
    </div>
  );
}

function ReceptionExams() {
  const { data: user } = useCurrentUser();
  const lookup = usePatientLookup();

  const booking = useExamBooking({
    healthUnitId: user?.healthUnitId,
    patient: lookup.patient,
    onBooked: lookup.reset,
  });

  return (
    <>
      <HeaderManager
        title="Marcar Exame"
        subtitle="Busque o paciente pelo CPF e marque o exame na fila do app"
        user={user}
      />

      <div className={style.page}>
        <PatientLookup lookup={lookup} />

        <BookingCard
          title="Dados do exame"
          isLocked={!lookup.patient}
          lockedHint="Busque um paciente pelo CPF para escolher exame e horário."
          confirmLabel="Confirmar exame"
          pendingLabel="Marcando..."
          canConfirm={booking.canConfirm}
          isPending={booking.isPending}
          onConfirm={booking.confirm}
        >
          <div className={style.fieldsGrid}>
            <label className={style.field}>
              <span>Exame</span>
              <Select
                value={booking.offeringId}
                onChange={(event) => booking.setOfferingId(event.target.value)}
              >
                <option value="">Selecione um exame</option>
                {booking.examOfferings.map((offering) => (
                  <option key={offering._id} value={offering._id}>
                    {offering.name}
                  </option>
                ))}
              </Select>
            </label>

            <div className={style.field}>
              <span>Data</span>
              <DatePicker
                value={booking.selectedDate}
                onChange={booking.setSelectedDate}
                minDate={new Date()}
              />
            </div>
          </div>

          {booking.selectedOffering && (
            <ExamOfferingDetails offering={booking.selectedOffering} />
          )}

          <SlotPicker
            slots={booking.slots}
            selectedTime={booking.selectedTime}
            onSelect={booking.setSelectedTime}
            isLoading={booking.isLoadingSlots}
            emptyMessage="Nenhum horário disponível para esse exame nesse dia."
          />
        </BookingCard>
      </div>
    </>
  );
}

export { ReceptionExams };
