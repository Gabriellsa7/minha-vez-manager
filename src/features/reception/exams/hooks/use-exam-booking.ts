import { useState } from 'react';
import { toast } from 'react-toastify';
import { useGetExamOfferingsByHealthUnitId } from '../../../../config/api/get-exam-offerings-by-health-unit-id';
import { useGetExamSlots } from '../../../../config/api/get-exam-slots';
import { usePostExamBooking } from '../../../../config/api/post-exam-booking';
import type { IPatient } from '../../../../config/entities/patient/patient.entity';
import { getDateKey } from '../../../../config/utils';
import { handleApiError } from '../../../../config/utils/handle-api-error';
import { getExamDateTimeFromDateAndTime } from '../../../../config/utils/patient-input';
import type { SlotOption } from '../../components/slot-picker/slot-picker';

interface UseExamBookingParams {
  healthUnitId?: string;
  patient: IPatient | null;
  onBooked: () => void;
}

const getComparableNow = () => {
  const now = new Date();
  return new Date(
    Date.UTC(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes()
    )
  );
};

export function useExamBooking({
  healthUnitId,
  patient,
  onBooked,
}: UseExamBookingParams) {
  const [selectedOfferingId, setSelectedOfferingId] = useState('');
  const [selectedDate, setSelectedDate] = useState(() =>
    getDateKey(new Date())
  );
  const [selectedTime, setSelectedTime] = useState('');

  const { data: examOfferings } = useGetExamOfferingsByHealthUnitId(
    healthUnitId,
    false
  );

  const offeringId = selectedOfferingId || examOfferings?.[0]?._id || '';
  const selectedOffering = examOfferings?.find(
    (offering) => offering._id === offeringId
  );

  const { data: slotsResponse, isLoading: isLoadingSlots } = useGetExamSlots(
    healthUnitId,
    selectedDate
  );

  const comparableNow = getComparableNow();
  const slots: SlotOption[] = (slotsResponse?.slots ?? []).map((slot) => {
    const isPast =
      getExamDateTimeFromDateAndTime(selectedDate, slot.time) <= comparableNow;
    const isFull = slot.remainingCapacity <= 0;

    return {
      time: slot.time,
      disabled: isPast || isFull,
      label: isFull ? `${slot.time} (lotado)` : slot.time,
    };
  });

  const effectiveSelectedTime = slots.some(
    (slot) => slot.time === selectedTime && !slot.disabled
  )
    ? selectedTime
    : '';

  const { mutate: createExamBooking, isPending } = usePostExamBooking();

  const canConfirm = Boolean(
    patient && selectedOffering && selectedDate && effectiveSelectedTime
  );

  const confirm = () => {
    if (!patient || !selectedOffering || !effectiveSelectedTime) return;

    const scheduledAt = getExamDateTimeFromDateAndTime(
      selectedDate,
      effectiveSelectedTime
    );

    createExamBooking(
      {
        patientId: patient._id,
        healthUnitId: selectedOffering.healthUnitId,
        examOfferingId: selectedOffering._id,
        scheduledAt: scheduledAt.toISOString(),
        notes: 'Agendamento realizado pela recepção',
      },
      {
        onSuccess: () => {
          toast.success('Exame marcado com sucesso.');
          setSelectedTime('');
          onBooked();
        },
        onError: handleApiError,
      }
    );
  };

  return {
    examOfferings: examOfferings ?? [],
    offeringId,
    setOfferingId: setSelectedOfferingId,
    selectedOffering,
    selectedDate,
    setSelectedDate,
    slots,
    isLoadingSlots,
    selectedTime: effectiveSelectedTime,
    setSelectedTime,
    canConfirm,
    isPending,
    confirm,
  };
}
