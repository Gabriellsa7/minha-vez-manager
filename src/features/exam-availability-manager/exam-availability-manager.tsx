import { useState } from 'react';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { SideBar } from '../../components/side-bar/side-bar-manager';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { HealthUnitSelect } from '../../components/health-unit-select/health-unit-select';
import { Field } from '../../components/field/field';
import { useCurrentUser } from '../../config/api/get-current-user';
import { useHealthUnitsByUserId } from '../../config/api/get-health-units-by-user-id';
import {
  GET_EXAM_AVAILABILITY_RULES_KEY,
  useGetExamAvailabilityRules,
} from '../../config/api/get-exam-availability-rules';
import { usePutExamAvailabilityRules } from '../../config/api/put-exam-availability-rules';
import {
  GET_EXAM_AVAILABILITY_BLACKOUTS_KEY,
  useGetExamAvailabilityBlackouts,
} from '../../config/api/get-exam-availability-blackouts';
import { usePostExamAvailabilityBlackout } from '../../config/api/post-exam-availability-blackout';
import { useDeleteExamAvailabilityBlackout } from '../../config/api/delete-exam-availability-blackout';
import { handleApiError } from '../../config/utils/handle-api-error';
import { SIDEBAR_MANAGER_ITEMS } from '../healt-unit-manager/constants';
import { weekDayLabel } from '../healt-unit-manager/components/health-unit-modal/constants';
import { WeekDay } from '../../config/entities/health-unit/health-unit.entity';
import style from './exam-availability-manager.module.scss';
import { WEEKDAY_ORDER, defaultRows } from './utils';
import type { RuleRow } from './utils';

function ExamAvailabilityManager() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  const { data: healthUnits } = useHealthUnitsByUserId(user?._id);
  const [selectedHealthUnitId, setSelectedHealthUnitId] = useState<string>();
  const healthUnitId = selectedHealthUnitId ?? healthUnits?.[0]?._id;

  const { data: rules } = useGetExamAvailabilityRules(healthUnitId);
  const { data: blackouts } = useGetExamAvailabilityBlackouts(healthUnitId);

  const [rows, setRows] = useState<RuleRow[]>(defaultRows());
  // Tracks which health unit `rows` was last populated from, so the fetched
  // rules can seed local editable state exactly once per unit without an
  // effect (see "Adjusting state when a prop changes" in the React docs).
  const [syncedHealthUnitId, setSyncedHealthUnitId] = useState<string | null>(
    null
  );
  const { mutateAsync: saveRules, isPending: isSaving } =
    usePutExamAvailabilityRules();

  const [blackoutDate, setBlackoutDate] = useState('');
  const [blackoutReason, setBlackoutReason] = useState('');
  const { mutateAsync: addBlackout, isPending: isAddingBlackout } =
    usePostExamAvailabilityBlackout();
  const { mutate: removeBlackout } = useDeleteExamAvailabilityBlackout();

  if (rules && healthUnitId && syncedHealthUnitId !== healthUnitId) {
    setSyncedHealthUnitId(healthUnitId);
    setRows(
      WEEKDAY_ORDER.map((weekday) => {
        const existing = rules.find((rule) => rule.weekday === weekday);
        return existing
          ? {
              weekday,
              enabled: existing.isActive,
              startTime: existing.startTime,
              endTime: existing.endTime,
              slotDurationMinutes: existing.slotDurationMinutes,
              capacityPerSlot: existing.capacityPerSlot,
            }
          : {
              weekday,
              enabled: false,
              startTime: '08:00',
              endTime: '12:00',
              slotDurationMinutes: 15,
              capacityPerSlot: 1,
            };
      })
    );
  }

  const updateRow = (weekday: WeekDay, patch: Partial<RuleRow>) => {
    setRows((current) =>
      current.map((row) =>
        row.weekday === weekday ? { ...row, ...patch } : row
      )
    );
  };

  const handleSaveRules = async () => {
    if (!healthUnitId) return;

    const enabledRows = rows.filter((row) => row.enabled);

    for (const row of enabledRows) {
      if (row.startTime >= row.endTime) {
        toast.error(
          `${weekDayLabel[row.weekday]}: o horário de início deve ser antes do término.`
        );
        return;
      }
      if (row.slotDurationMinutes <= 0) {
        toast.error(
          `${weekDayLabel[row.weekday]}: a duração deve ser maior que zero.`
        );
        return;
      }
    }

    try {
      await saveRules({
        healthUnitId,
        rules: enabledRows.map((row) => ({
          weekday: row.weekday,
          startTime: row.startTime,
          endTime: row.endTime,
          slotDurationMinutes: row.slotDurationMinutes,
          capacityPerSlot: row.capacityPerSlot,
          isActive: true,
        })),
      });
      await queryClient.invalidateQueries({
        queryKey: [GET_EXAM_AVAILABILITY_RULES_KEY, healthUnitId],
      });
      toast.success('Disponibilidade atualizada com sucesso.');
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleAddBlackout = async () => {
    if (!healthUnitId || !blackoutDate) return;

    try {
      await addBlackout({
        healthUnitId,
        date: blackoutDate,
        reason: blackoutReason || undefined,
      });
      await queryClient.invalidateQueries({
        queryKey: [GET_EXAM_AVAILABILITY_BLACKOUTS_KEY, healthUnitId],
      });
      setBlackoutDate('');
      setBlackoutReason('');
      toast.success('Data bloqueada com sucesso.');
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleRemoveBlackout = (id: string) => {
    removeBlackout(id, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [GET_EXAM_AVAILABILITY_BLACKOUTS_KEY, healthUnitId],
        });
      },
      onError: handleApiError,
    });
  };

  return (
    <div className={style.container}>
      <SideBar
        items={SIDEBAR_MANAGER_ITEMS}
        pageTitle="Painel Manager"
        user={user}
      />
      <div className={style.mainContent}>
        <HeaderManager
          title="Disponibilidade de Exames"
          subtitle="Configure os dias, horários e capacidade de agendamento"
          onButtonClick={() => {}}
          user={user}
        />
        <HealthUnitSelect
          healthUnits={healthUnits}
          value={healthUnitId}
          onChange={setSelectedHealthUnitId}
        />

        <div className={style.content}>
          <section className={style.rulesSection}>
            <h2>Horário semanal</h2>

            <div className={`${style.ruleRow} ${style.ruleHeader}`}>
              <span>Dia</span>
              <span>Início</span>
              <span>Término</span>
              <span>Duração da vaga (min)</span>
            </div>

            {rows.map((row) => (
              <div key={row.weekday} className={style.ruleRow}>
                <label className={style.checkbox}>
                  <input
                    type="checkbox"
                    checked={row.enabled}
                    onChange={(event) =>
                      updateRow(row.weekday, { enabled: event.target.checked })
                    }
                  />
                  {weekDayLabel[row.weekday]}
                </label>

                <div className={style.fieldGroup}>
                  <span className={style.fieldLabel}>Início</span>
                  <input
                    type="time"
                    value={row.startTime}
                    disabled={!row.enabled}
                    onChange={(event) =>
                      updateRow(row.weekday, { startTime: event.target.value })
                    }
                  />
                </div>

                <div className={style.fieldGroup}>
                  <span className={style.fieldLabel}>Término</span>
                  <input
                    type="time"
                    value={row.endTime}
                    disabled={!row.enabled}
                    onChange={(event) =>
                      updateRow(row.weekday, { endTime: event.target.value })
                    }
                  />
                </div>

                <div className={style.fieldGroup}>
                  <span className={style.fieldLabel}>
                    Duração da vaga (min)
                  </span>
                  <input
                    type="number"
                    min="1"
                    disabled={!row.enabled}
                    value={row.slotDurationMinutes}
                    title="De quantos em quantos minutos um novo horário é aberto (ex.: 15 = horários às 08:00, 08:15, 08:30...)"
                    onChange={(event) =>
                      updateRow(row.weekday, {
                        slotDurationMinutes: Number(event.target.value),
                      })
                    }
                  />
                </div>

              </div>
            ))}
            <button
              type="button"
              className={style.saveButton}
              disabled={isSaving || !healthUnitId}
              onClick={handleSaveRules}
            >
              {isSaving ? 'Salvando...' : 'Salvar disponibilidade'}
            </button>
          </section>

          <section className={style.blackoutSection}>
            <h2>Dias sem atendimento</h2>
            <div className={style.blackoutForm}>
              <Field label="Data">
                <input
                  type="date"
                  value={blackoutDate}
                  onChange={(event) => setBlackoutDate(event.target.value)}
                />
              </Field>
              <Field label="Motivo (opcional)">
                <input
                  value={blackoutReason}
                  onChange={(event) => setBlackoutReason(event.target.value)}
                  placeholder="Ex.: Feriado"
                />
              </Field>
              <button
                type="button"
                className={style.saveButton}
                disabled={isAddingBlackout || !blackoutDate}
                onClick={handleAddBlackout}
              >
                Bloquear data
              </button>
            </div>

            <div className={style.blackoutList}>
              {blackouts?.length ? (
                blackouts.map((blackout) => (
                  <div key={blackout._id} className={style.blackoutItem}>
                    <span>
                      {new Date(blackout.date).toLocaleDateString('pt-BR', {
                        timeZone: 'UTC',
                      })}
                      {blackout.reason ? ` — ${blackout.reason}` : ''}
                    </span>
                    <button
                      type="button"
                      aria-label="Remover bloqueio"
                      onClick={() => handleRemoveBlackout(blackout._id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <p className={style.empty}>Nenhuma data bloqueada.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export { ExamAvailabilityManager };
