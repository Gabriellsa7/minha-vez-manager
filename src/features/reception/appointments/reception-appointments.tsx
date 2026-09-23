import { DatePicker } from '../../../components/date-picker/date-picker';
import { HeaderManager } from '../../../components/header-manager/header-manager';
import { Select } from '../../../components/select/select';
import { useCurrentUser } from '../../../config/api/get-current-user';
import { BookingCard } from '../components/booking-card/booking-card';
import { usePatientLookup } from '../components/patient-lookup/hooks/use-patient-lookup';
import { PatientLookup } from '../components/patient-lookup/patient-lookup';
import { SlotPicker } from '../components/slot-picker/slot-picker';
import style from '../reception.module.scss';
import { useAppointmentBooking } from './hooks/use-appointment-booking';

function ReceptionAppointments() {
  const { data: user } = useCurrentUser();
  const lookup = usePatientLookup();

  const booking = useAppointmentBooking({
    healthUnitId: user?.healthUnitId,
    patient: lookup.patient,
    onBooked: lookup.reset,
  });

  return (
    <>
      <HeaderManager
        title="Marcar Consulta"
        subtitle="Busque o paciente pelo CPF e marque a consulta na fila do app"
        user={user}
      />

      <div className={style.page}>
        <PatientLookup lookup={lookup} />

        <BookingCard
          title="Dados da consulta"
          isLocked={!lookup.patient}
          lockedHint="Busque um paciente pelo CPF para escolher profissional e horário."
          confirmLabel="Confirmar consulta"
          pendingLabel="Marcando..."
          canConfirm={booking.canConfirm}
          isPending={booking.isPending}
          onConfirm={booking.confirm}
        >
          <div className={style.fieldsGrid}>
            <label className={style.field}>
              <span>Profissional</span>
              <Select
                value={booking.professionalId}
                onChange={(event) =>
                  booking.setProfessionalId(event.target.value)
                }
              >
                <option value="">Selecione um profissional</option>
                {booking.professionals.map((professional) => (
                  <option key={professional._id} value={professional._id}>
                    {professional.name} — {professional.specialty}
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

          <SlotPicker
            slots={booking.slotTimes.map((time) => ({ time }))}
            selectedTime={booking.selectedTime}
            onSelect={booking.setSelectedTime}
            isLoading={booking.isLoadingSlots}
            emptyMessage="Nenhum horário disponível para esse profissional nesse dia."
          />
        </BookingCard>
      </div>
    </>
  );
}

export { ReceptionAppointments };
