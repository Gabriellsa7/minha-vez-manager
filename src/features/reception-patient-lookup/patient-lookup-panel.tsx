import { Search, UserRoundX } from 'lucide-react';
import { getUserInitials } from '../../config/utils';
import { useUserById } from '../../config/api/get-user-by-id';
import { PatientRegistrationModal } from './components/patient-registration-modal/patient-registration-modal';
import type { UsePatientLookupReturn } from './hooks/use-patient-lookup';
import style from './patient-lookup-panel.module.scss';

interface PatientLookupPanelProps {
  lookup: UsePatientLookupReturn;
}

function PatientLookupPanel({ lookup }: PatientLookupPanelProps) {
  const {
    cpf,
    setCpf,
    search,
    isSearching,
    patient,
    patientNotFound,
    showRegistrationModal,
    setShowRegistrationModal,
    handleRegistered,
    reset,
  } = lookup;

  const { data: patientUser } = useUserById(patient?.userId);

  return (
    <div className={style.card}>
      <h3 className={style.title}>Buscar paciente pelo CPF</h3>
      <div className={style.searchRow}>
        <input
          className={style.input}
          value={cpf}
          onChange={(event) => setCpf(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              search();
            }
          }}
          placeholder="000.000.000-00"
          inputMode="numeric"
          disabled={Boolean(patient)}
        />
        {patient ? (
          <button
            type="button"
            className={style.searchButton}
            onClick={reset}
          >
            Trocar paciente
          </button>
        ) : (
          <button
            type="button"
            className={style.searchButton}
            onClick={search}
            disabled={isSearching}
          >
            <Search size={14} style={{ marginRight: 6 }} />
            {isSearching ? 'Buscando...' : 'Buscar'}
          </button>
        )}
      </div>

      {patient && (
        <div className={style.result}>
          <div className={style.patientInfo}>
            <div className={style.profileImg}>
              <span>{getUserInitials(patientUser?.name ?? '')}</span>
            </div>
            <div>
              <strong>{patientUser?.name ?? 'Paciente encontrado'}</strong>
              <br />
              <span>CPF {cpf}</span>
            </div>
          </div>
        </div>
      )}

      {patientNotFound && (
        <div className={style.notFound}>
          <span className={style.notFoundText}>
            <UserRoundX
              size={14}
              style={{ verticalAlign: 'text-bottom', marginRight: 6 }}
            />
            Nenhum paciente encontrado com esse CPF.
          </span>
          <button
            type="button"
            className={style.registerButton}
            onClick={() => setShowRegistrationModal(true)}
          >
            Cadastrar paciente
          </button>
        </div>
      )}

      <PatientRegistrationModal
        open={showRegistrationModal}
        cpf={cpf}
        onClose={() => setShowRegistrationModal(false)}
        onRegistered={handleRegistered}
      />
    </div>
  );
}

export { PatientLookupPanel };
