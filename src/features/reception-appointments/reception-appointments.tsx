import { useMemo, useState } from 'react';
import { Clock3, CalendarCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import { SideBar } from '../../components/side-bar/side-bar-manager';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { useCurrentUser } from '../../config/api/get-current-user';
import { useHealthUnitById } from '../../config/api/get-health-unit-by-id';
import { useGetHealthProfessionals } from '../../config/api/get-health-professionals';
import { useGetAppointmentsByProfessionalId } from '../../config/api/get-appointments-by-professional-id';
import { usePostAppointment } from '../../config/api/post-appointment';
import {
  appointmentsStatus,
} from '../../config/entities/appointments/appointment.entity';
import {
  generateTimes,
  getDateKey,
  getDateTimeFromDateAndTime,
  isTimeWithinOpeningHours,
} from '../../config/utils';
import { handleApiError } from '../../config/utils/handle-api-error';
import { usePatientLookup } from '../reception-patient-lookup/hooks/use-patient-lookup';
import { PatientLookupPanel } from '../reception-patient-lookup/patient-lookup-panel';
import { SIDEBAR_RECEPTION_ITEMS } from './constants';
import style from './reception-appointments.module.scss';

function ReceptionAppointments() {
  const { data: user } = useCurrentUser();
  const healthUnitId = user?.healthUnitId;

  const { data: healthUnit } = useHealthUnitById(healthUnitId);
  const { data: allProfessionals } = useGetHealthProfessionals();

  const professionalsForUnit = useMemo(
    () =>
      (allProfessionals ?? []).filter(
        (professional) => professional.healthUnitId === healthUnitId
      ),
    [allProfessionals, healthUnitId]
  );

  const [selectedProfessionalId, setSelectedProfessionalId] = useState('');
  const [selectedDate, setSelectedDate] = useState(() =>
    getDateKey(new Date())
  );
  const [selectedTime, setSelectedTime] = useState('');

  const professionalId =
    selectedProfessionalId || professionalsForUnit[0]?._id || '';

  const selectedProfessional = professionalsForUnit.find(
    (professional) => professional._id === professionalId
  );

  const { data: professionalAppointments } = useGetAppointmentsByProfessionalId(
    professionalId || undefined
  );

  const bookedTimes = useMemo(() => {
    const times = new Set<string>();

    professionalAppointments?.forEach((appointment) => {
      if (
        appointment.status === appointmentsStatus.COMPLETED ||
        appointment.status === appointmentsStatus.CANCELED
      ) {
        return;
      }

      const appointmentDate = new Date(appointment.dateTime);
      if (getDateKey(appointmentDate) !== selectedDate) return;

      const hour = String(appointmentDate.getHours()).padStart(2, '0');
      const minute = String(appointmentDate.getMinutes()).padStart(2, '0');
      times.add(`${hour}:${minute}`);
    });

    return times;
  }, [professionalAppointments, selectedDate]);

  const availableTimes = useMemo(() => {
    if (!selectedProfessional) return [];

    const openingHours = healthUnit?.openingHours ?? [];

    return [
      ...generateTimes(
        selectedProfessional.schedule.morning?.start || '',
        selectedProfessional.schedule.morning?.end || '',
        selectedProfessional.schedule.appointmentDuration
      ),
      ...generateTimes(
        selectedProfessional.schedule.afternoon?.start || '',
        selectedProfessional.schedule.afternoon?.end || '',
        selectedProfessional.schedule.appointmentDuration
      ),
    ].filter((time) => isTimeWithinOpeningHours(openingHours, selectedDate, time));
  }, [selectedProfessional, healthUnit, selectedDate]);

  // Rather than clearing `selectedTime` via an effect whenever the
  // professional/date changes, treat a selection that's no longer in the
  // freshly computed slot list as unselected.
  const effectiveSelectedTime = availableTimes.includes(selectedTime)
    ? selectedTime
    : '';

  const lookup = usePatientLookup();
  const { mutate: createAppointment, isPending } = usePostAppointment();

  const handleConfirm = () => {
    if (
      !lookup.patient ||
      !selectedProfessional ||
      !selectedDate ||
      !effectiveSelectedTime
    ) {
      return;
    }

    const dateTime = getDateTimeFromDateAndTime(
      selectedDate,
      effectiveSelectedTime
    );

    createAppointment(
      {
        patientId: lookup.patient._id,
        professionalId: selectedProfessional._id,
        healthUnitId: selectedProfessional.healthUnitId,
        dateTime: dateTime.toISOString(),
        notes: 'Agendamento realizado pela recepção',
      },
      {
        onSuccess: () => {
          toast.success('Consulta marcada com sucesso.');
          setSelectedTime('');
          lookup.reset();
        },
        onError: handleApiError,
      }
    );
  };

  const canConfirm = Boolean(
    lookup.patient &&
      selectedProfessional &&
      selectedDate &&
      effectiveSelectedTime
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
          title="Marcar Consulta"
          subtitle="Busque o paciente pelo CPF e marque a consulta na fila do app"
          onButtonClick={() => {}}
          user={user}
        />

        <PatientLookupPanel lookup={lookup} />

        <div
          className={`${style.card} ${!lookup.patient ? style.disabled : ''}`}
        >
          <label className={style.field}>
            <span>Profissional</span>
            <select
              value={professionalId}
              onChange={(event) => setSelectedProfessionalId(event.target.value)}
            >
              <option value="">Selecione um profissional</option>
              {professionalsForUnit.map((professional) => (
                <option key={professional._id} value={professional._id}>
                  {professional.name} — {professional.specialty}
                </option>
              ))}
            </select>
          </label>

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
          {availableTimes.length === 0 ? (
            <p className={style.empty}>
              Nenhum horário disponível para esse profissional nesse dia.
            </p>
          ) : (
            <div className={style.timesGrid}>
              {availableTimes.map((time) => {
                const isBooked = bookedTimes.has(time);
                const isPast =
                  getDateTimeFromDateAndTime(selectedDate, time) <= new Date();
                const isUnavailable = isBooked || isPast;
                const isSelected = effectiveSelectedTime === time;

                return (
                  <button
                    key={time}
                    type="button"
                    disabled={isUnavailable}
                    onClick={() => setSelectedTime(time)}
                    className={`${style.timeSlot} ${
                      isSelected ? style.timeSlotSelected : ''
                    }`}
                  >
                    <Clock3 size={14} />
                    {time}
                    {isBooked && ' (ocupado)'}
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
            {isPending ? 'Marcando...' : 'Confirmar consulta'}
          </button>
        </div>
      </div>
    </div>
  );
}

export { ReceptionAppointments };
