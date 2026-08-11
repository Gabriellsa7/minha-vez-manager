import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock3, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import style from './mark-return-modal.module.scss';
import type { IHealthProfessional } from '../../../../config/entities/health-profissional/health-professional.entity';
import { appointmentsStatus } from '../../../../config/entities/appointments/appointment.entity';
import {
  useGetAppointmentsByProfessionalId,
  GET_APPOINTMENTS_BY_PROFESSIONAL_ID_KEY,
} from '../../api/get-appointments-by-professional-id';
import { useCreateAppointment } from '../../api/create-appointment';
import { GET_QUEUE_MANAGEMENT } from '../../api/get-queue-management-by-professional-id';
import { GET_QUEUES_BY_PROFESSIONAL_ID } from '../../api/get-queues-by-professional-id';
import { handleApiError } from '../../../../config/utils/handle-api-error';
import {
  generateTimes,
  getDateKey,
  getDateTimeFromDateAndTime,
  isSameMonth,
  startOfDay,
} from '../../../../config/utils';

interface MarkReturnModalProps {
  onClose: () => void;
  professional?: IHealthProfessional;
  patientId: string;
  patientName: string;
  originQueueItemId: string;
}

const WEEKDAY_LABELS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

// Mounted by the parent only while the modal should be visible, so state
// naturally starts fresh on every open instead of needing a reset effect.
function MarkReturnModal({
  onClose,
  professional,
  patientId,
  patientName,
  originQueueItemId,
}: MarkReturnModalProps) {
  const queryClient = useQueryClient();

  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(() =>
    getDateKey(new Date()),
  );
  const [selectedTime, setSelectedTime] = useState('');

  const { data: appointments, isLoading: isAppointmentsLoading } =
    useGetAppointmentsByProfessionalId(professional?._id, {
      enabled: Boolean(professional?._id),
    });

  const { mutate: createAppointment, isPending: isCreating } =
    useCreateAppointment();

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isCreating) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isCreating, onClose]);

  const calendarMonthLabel = useMemo(() => {
    const label = calendarMonth.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric',
    });

    return label.charAt(0).toUpperCase() + label.slice(1);
  }, [calendarMonth]);

  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth(),
      1
    );
    const firstVisibleDay = new Date(firstDayOfMonth);
    firstVisibleDay.setDate(
      firstVisibleDay.getDate() - firstDayOfMonth.getDay()
    );

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(firstVisibleDay);
      date.setDate(firstVisibleDay.getDate() + index);

      return date;
    });
  }, [calendarMonth]);

  const canGoToPreviousMonth = useMemo(() => {
    const today = new Date();
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    return calendarMonth > currentMonth;
  }, [calendarMonth]);

  const handleChangeCalendarMonth = (direction: 'previous' | 'next') => {
    setCalendarMonth((currentMonth) => {
      const nextMonth = new Date(currentMonth);
      nextMonth.setMonth(
        currentMonth.getMonth() + (direction === 'next' ? 1 : -1)
      );

      return nextMonth;
    });
  };

  const availableTimes = useMemo(() => {
    if (!professional) return [];

    return [
      ...generateTimes(
        professional.schedule.morning?.start || '',
        professional.schedule.morning?.end || '',
        professional.schedule.appointmentDuration
      ),
      ...generateTimes(
        professional.schedule.afternoon?.start || '',
        professional.schedule.afternoon?.end || '',
        professional.schedule.appointmentDuration
      ),
    ];
  }, [professional]);

  const bookedTimes = useMemo(() => {
    if (!appointments || !selectedDate) return new Set<string>();

    return appointments.reduce((times, appointment) => {
      if (
        appointment.status === appointmentsStatus.COMPLETED ||
        appointment.status === appointmentsStatus.CANCELED
      ) {
        return times;
      }

      const dateKey = getDateKey(new Date(appointment.dateTime));

      if (dateKey === selectedDate) {
        const appointmentDate = new Date(appointment.dateTime);
        const hour = String(appointmentDate.getHours()).padStart(2, '0');
        const minute = String(appointmentDate.getMinutes()).padStart(2, '0');
        times.add(`${hour}:${minute}`);
      }

      return times;
    }, new Set<string>());
  }, [appointments, selectedDate]);

  const closeModal = () => {
    if (isCreating) return;
    onClose();
  };

  const handleConfirm = () => {
    if (!professional || !selectedDate || !selectedTime) return;

    const dateTime = getDateTimeFromDateAndTime(selectedDate, selectedTime);

    if (dateTime <= new Date()) {
      toast.error('Escolha um horário futuro para o retorno.');
      setSelectedTime('');
      return;
    }

    createAppointment(
      {
        patientId,
        professionalId: professional._id,
        healthUnitId: professional.healthUnitId,
        dateTime: dateTime.toISOString(),
        notes: 'Retorno agendado pelo profissional',
        isReturn: true,
        originQueueItemId,
      },
      {
        onSuccess: async () => {
          toast.success('Retorno agendado com sucesso.');
          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: [
                GET_APPOINTMENTS_BY_PROFESSIONAL_ID_KEY,
                professional._id,
              ],
            }),
            queryClient.invalidateQueries({
              queryKey: [GET_QUEUE_MANAGEMENT, professional._id],
            }),
            queryClient.invalidateQueries({
              queryKey: [GET_QUEUES_BY_PROFESSIONAL_ID, professional._id],
            }),
          ]);
          onClose();
        },
        onError: handleApiError,
      }
    );
  };

  return (
    <div className={style.overlay} onMouseDown={closeModal}>
      <div
        className={style.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mark-return-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={style.header}>
          <div>
            <h2 id="mark-return-modal-title">Marcar retorno</h2>
            <span>Paciente: {patientName}</span>
          </div>
          <button
            className={style.closeButton}
            type="button"
            onClick={closeModal}
            aria-label="Fechar modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className={style.body}>
          <div className={style.calendarSection}>
            <span className={style.sectionLabel}>Escolha o dia</span>
            <div className={style.calendarCard}>
              <div className={style.calendarHeader}>
                <span>{calendarMonthLabel}</span>
                <div className={style.calendarNav}>
                  <button
                    type="button"
                    onClick={() => handleChangeCalendarMonth('previous')}
                    disabled={!canGoToPreviousMonth}
                    aria-label="Mês anterior"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChangeCalendarMonth('next')}
                    aria-label="Próximo mês"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div className={style.weekDays}>
                {WEEKDAY_LABELS.map((weekday) => (
                  <span key={weekday}>{weekday}</span>
                ))}
              </div>

              <div className={style.daysGrid}>
                {calendarDays.map((day) => {
                  const dateKey = getDateKey(day);
                  const isCurrentMonth = isSameMonth(day, calendarMonth);
                  const isSelected = selectedDate === dateKey;
                  const isPastDay = startOfDay(day) < startOfDay(new Date());
                  const isDisabled = !isCurrentMonth || isPastDay;

                  return (
                    <button
                      type="button"
                      key={dateKey}
                      disabled={isDisabled}
                      onClick={() => {
                        setSelectedDate(dateKey);
                        setSelectedTime('');
                      }}
                      className={`${style.day} ${
                        isSelected ? style.daySelected : ''
                      } ${isDisabled ? style.dayDisabled : ''}`}
                    >
                      {day.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={style.timesSection}>
            <span className={style.sectionLabel}>Horários disponíveis</span>
            <div className={style.timesGrid}>
              {availableTimes.length === 0 && (
                <p className={style.emptyState}>
                  Este profissional não possui horários configurados.
                </p>
              )}
              {availableTimes.map((time) => {
                const isSelected = selectedTime === time;
                const isBooked = bookedTimes.has(time);
                const isPast =
                  Boolean(selectedDate) &&
                  getDateTimeFromDateAndTime(selectedDate, time) <=
                    new Date();
                const isUnavailable =
                  isBooked || isPast || isAppointmentsLoading;

                return (
                  <button
                    type="button"
                    key={time}
                    disabled={isUnavailable}
                    onClick={() => setSelectedTime(time)}
                    className={`${style.time} ${
                      isSelected ? style.timeSelected : ''
                    } ${isUnavailable ? style.timeDisabled : ''}`}
                  >
                    <Clock3 size={14} />
                    {time}
                    {isBooked && (
                      <span className={style.timeHint}>Ocupado</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className={style.actions}>
          <button
            type="button"
            className={style.cancelButton}
            onClick={closeModal}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={style.submitButton}
            disabled={!selectedDate || !selectedTime || isCreating}
            onClick={handleConfirm}
          >
            {isCreating ? 'Agendando...' : 'Confirmar retorno'}
          </button>
        </div>
      </div>
    </div>
  );
}

export { MarkReturnModal };
