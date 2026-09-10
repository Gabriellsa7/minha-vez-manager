import { useMemo, useState } from 'react';
import { Clock3, CalendarCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { SideBar } from '../../components/side-bar/side-bar-manager';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { useCurrentUser } from '../../config/api/get-current-user';
import { useGetHealthProfessionals } from '../../config/api/get-health-professionals';
import {
  useGetAvailableSlots,
  GET_AVAILABLE_SLOTS_KEY,
} from '../../config/api/get-available-slots';
import { usePostAppointment } from '../../config/api/post-appointment';
import { getDateKey } from '../../config/utils';
import { handleApiError } from '../../config/utils/handle-api-error';
import { usePatientLookup } from '../reception-patient-lookup/hooks/use-patient-lookup';
import { PatientLookupPanel } from '../reception-patient-lookup/patient-lookup-panel';
import { SIDEBAR_RECEPTION_ITEMS } from './constants';
import style from './reception-appointments.module.scss';

function ReceptionAppointments() {
  const { data: user } = useCurrentUser();
  const healthUnitId = user?.healthUnitId;

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

  const { data: availableSlots } = useGetAvailableSlots({
    professionalId: professionalId || undefined,
    date: selectedDate || undefined,
  });

  const slotsByTime = useMemo(() => {
    const map = new Map<string, string>();
    availableSlots?.forEach((slot) => map.set(slot.time, slot.dateTime));
    return map;
  }, [availableSlots]);

  const availableTimes = useMemo(
    () => Array.from(slotsByTime.keys()),
    [slotsByTime]
  );

  const effectiveSelectedTime = availableTimes.includes(selectedTime)
    ? selectedTime
    : '';

  const lookup = usePatientLookup();
  const queryClient = useQueryClient();
  const { mutate: createAppointment, isPending } = usePostAppointment();

  const handleConfirm = () => {
    const dateTime = slotsByTime.get(effectiveSelectedTime);

    if (!lookup.patient || !selectedProfessional || !dateTime) {
      return;
    }

    createAppointment(
      {
        patientId: lookup.patient._id,
        professionalId: selectedProfessional._id,
        healthUnitId: selectedProfessional.healthUnitId,
        dateTime,
        notes: 'Agendamento realizado pela recepção',
        isWalkIn: true,
      },
      {
        onSuccess: async () => {
          toast.success('Consulta marcada com sucesso.');
          setSelectedTime('');
          lookup.reset();
          await queryClient.invalidateQueries({
            queryKey: [GET_AVAILABLE_SLOTS_KEY],
          });
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
              onChange={(event) =>
                setSelectedProfessionalId(event.target.value)
              }
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
                const isSelected = effectiveSelectedTime === time;

                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`${style.timeSlot} ${
                      isSelected ? style.timeSlotSelected : ''
                    }`}
                  >
                    <Clock3 size={14} />
                    {time}
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
