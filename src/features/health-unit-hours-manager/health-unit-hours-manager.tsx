import { useState } from 'react';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { SideBar } from '../../components/side-bar/side-bar-manager';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { HealthUnitSelect } from '../../components/health-unit-select/health-unit-select';
import { useCurrentUser } from '../../config/api/get-current-user';
import {
  GET_HEALTH_UNITS_BY_USER_ID_KEY,
  useHealthUnitsByUserId,
} from '../../config/api/get-health-units-by-user-id';
import { useUpdateHealthUnit } from '../../config/api/update-health-unit';
import { handleApiError } from '../../config/utils/handle-api-error';
import { SIDEBAR_MANAGER_ITEMS } from '../healt-unit-manager/constants';
import { weekDayLabel } from '../healt-unit-manager/components/health-unit-modal/constants';
import type { IHealthUnitOpeningHours } from '../../config/entities/health-unit/health-unit.entity';
import style from './health-unit-hours-manager.module.scss';
import { WEEKDAY_ORDER, defaultOpeningHours } from './utils';

function HealthUnitHoursManager() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  const { data: healthUnits } = useHealthUnitsByUserId(user?._id);
  const [selectedHealthUnitId, setSelectedHealthUnitId] = useState<string>();
  const healthUnitId = selectedHealthUnitId ?? healthUnits?.[0]?._id;
  const selectedHealthUnit = healthUnits?.find(
    (healthUnit) => healthUnit._id === healthUnitId
  );

  const [rows, setRows] = useState<IHealthUnitOpeningHours[]>(
    defaultOpeningHours()
  );
  // Tracks which health unit `rows` was last populated from, so the fetched
  // opening hours can seed local editable state exactly once per unit
  // without an effect (see "Adjusting state when a prop changes").
  const [syncedHealthUnitId, setSyncedHealthUnitId] = useState<string | null>(
    null
  );
  const { mutateAsync: updateHealthUnit, isPending: isSaving } =
    useUpdateHealthUnit();

  if (
    selectedHealthUnit &&
    healthUnitId &&
    syncedHealthUnitId !== healthUnitId
  ) {
    setSyncedHealthUnitId(healthUnitId);
    setRows(
      WEEKDAY_ORDER.map((day) => {
        const existing = selectedHealthUnit.openingHours.find(
          (openingHour) => openingHour.day === day
        );
        return (
          existing ?? {
            day,
            open: '08:00',
            close: '18:00',
            isClosed: true,
          }
        );
      })
    );
  }

  const updateRow = (day: string, patch: Partial<IHealthUnitOpeningHours>) => {
    setRows((current) =>
      current.map((row) => (row.day === day ? { ...row, ...patch } : row))
    );
  };

  const handleSave = async () => {
    if (!healthUnitId) return;

    for (const row of rows) {
      if (row.isClosed) continue;

      if (!row.open || !row.close || row.open >= row.close) {
        toast.error(
          `${weekDayLabel[row.day]}: o horário de abertura deve ser antes do fechamento.`
        );
        return;
      }
    }

    try {
      await updateHealthUnit({
        id: healthUnitId,
        data: { openingHours: rows },
      });
      await queryClient.invalidateQueries({
        queryKey: [GET_HEALTH_UNITS_BY_USER_ID_KEY],
      });
      toast.success('Horário de funcionamento atualizado com sucesso.');
    } catch (error) {
      handleApiError(error);
    }
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
          title="Horário de Funcionamento"
          subtitle="Configure os dias e horários de atendimento da unidade"
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
              <span>Fechado</span>
              <span>Abertura</span>
              <span>Fechamento</span>
            </div>

            {rows.map((row) => (
              <div key={row.day} className={style.ruleRow}>
                <span className={style.fieldGroup}>
                  <span className={style.fieldLabel}>Dia</span>
                  {weekDayLabel[row.day]}
                </span>

                <label className={style.checkbox}>
                  <input
                    type="checkbox"
                    checked={row.isClosed}
                    onChange={(event) =>
                      updateRow(row.day, { isClosed: event.target.checked })
                    }
                  />
                  Fechado
                </label>

                <div className={style.fieldGroup}>
                  <span className={style.fieldLabel}>Abertura</span>
                  <input
                    type="time"
                    value={row.open ?? ''}
                    disabled={row.isClosed}
                    onChange={(event) =>
                      updateRow(row.day, { open: event.target.value })
                    }
                  />
                </div>

                <div className={style.fieldGroup}>
                  <span className={style.fieldLabel}>Fechamento</span>
                  <input
                    type="time"
                    value={row.close ?? ''}
                    disabled={row.isClosed}
                    onChange={(event) =>
                      updateRow(row.day, { close: event.target.value })
                    }
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              className={style.saveButton}
              disabled={isSaving || !healthUnitId}
              onClick={handleSave}
            >
              {isSaving ? 'Salvando...' : 'Salvar horário'}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

export { HealthUnitHoursManager };
