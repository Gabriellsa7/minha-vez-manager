import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useGetAvailableSlots } from '../../../../config/api/get-available-slots';
import { useGetHealthProfessionals } from '../../../../config/api/get-health-professionals';
import { usePostAppointment } from '../../../../config/api/post-appointment';
import type { IPatient } from '../../../../config/entities/patient/patient.entity';
import { getDateKey } from '../../../../config/utils';
import { handleApiError } from '../../../../config/utils/handle-api-error';

interface UseAppointmentBookingParams {
  healthUnitId?: string;
  patient: IPatient | null;
  onBooked: () => void;
}

export function useAppointmentBooking({
  healthUnitId,
  patient,
  onBooked,
}: UseAppointmentBookingParams) {
  const [selectedProfessionalId, setSelectedProfessionalId] = useState('');
  const [selectedDate, setSelectedDate] = useState(() =>
    getDateKey(new Date())
  );
  const [selectedTime, setSelectedTime] = useState('');

  const { data: allProfessionals } = useGetHealthProfessionals();

  const professionals = useMemo(
    () =>
      (allProfessionals ?? []).filter(
        (professional) => professional.healthUnitId === healthUnitId
      ),
    [allProfessionals, healthUnitId]
  );

  const professionalId = selectedProfessionalId || professionals[0]?._id || '';
  const selectedProfessional = professionals.find(
    (professional) => professional._id === professionalId
  );

  const { data: availableSlots, isLoading: isLoadingSlots } =
    useGetAvailableSlots({
      professionalId: professionalId || undefined,
      date: selectedDate || undefined,
    });

  const slots = useMemo(() => {
    const dateTimeByTime = new Map<string, string>();
    availableSlots?.forEach((slot) =>
      dateTimeByTime.set(slot.time, slot.dateTime)
    );
    return dateTimeByTime;
  }, [availableSlots]);

  const effectiveSelectedTime = slots.has(selectedTime) ? selectedTime : '';

  const { mutate: createAppointment, isPending } = usePostAppointment();

  const canConfirm = Boolean(
    patient && selectedProfessional && selectedDate && effectiveSelectedTime
  );

  const confirm = () => {
    const dateTime = slots.get(effectiveSelectedTime);
    if (!patient || !selectedProfessional || !dateTime) return;

    createAppointment(
      {
        patientId: patient._id,
        professionalId: selectedProfessional._id,
        healthUnitId: selectedProfessional.healthUnitId,
        dateTime,
        notes: 'Agendamento realizado pela recepção',
        isWalkIn: true,
      },
      {
        onSuccess: () => {
          toast.success('Consulta marcada com sucesso.');
          setSelectedTime('');
          onBooked();
        },
        onError: handleApiError,
      }
    );
  };

  return {
    professionals,
    professionalId,
    setProfessionalId: setSelectedProfessionalId,
    selectedDate,
    setSelectedDate,
    slotTimes: Array.from(slots.keys()),
    isLoadingSlots,
    selectedTime: effectiveSelectedTime,
    setSelectedTime,
    canConfirm,
    isPending,
    confirm,
  };
}
