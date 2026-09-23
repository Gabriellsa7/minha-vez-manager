import { Search, UserRoundX } from 'lucide-react';
import { useUserById } from '../../../../config/api/get-user-by-id';
import { getUserInitials } from '../../../../config/utils';
import { PatientRegistrationModal } from '../patient-registration-modal/patient-registration-modal';
import type { UsePatientLookupReturn } from './hooks/use-patient-lookup';
import style from './patient-lookup.module.scss';

interface PatientLookupProps {
  lookup: UsePatientLookupReturn;
}

function PatientLookup({ lookup }: PatientLookupProps) {
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
    <section className={style.card} aria-labelledby="patient-lookup-title">
      <label
        id="patient-lookup-title"
        className={style.title}
        htmlFor="patient-lookup-cpf"
      >
        Buscar paciente pelo CPF
      </label>
      <form
        className={style.searchRow}
        onSubmit={(event) => {
          event.preventDefault();
          if (!patient) search();
        }}
      >
        <input
          id="patient-lookup-cpf"
          className={style.input}
          value={cpf}
          onChange={(event) => setCpf(event.target.value)}
          placeholder="000.000.000-00"
          inputMode="numeric"
          autoComplete="off"
          disabled={Boolean(patient)}
        />
        {patient ? (
          <button
            type="button"
            className={style.secondaryButton}
            onClick={reset}
          >
            Trocar paciente
          </button>
        ) : (
          <button
            type="submit"
            className={style.searchButton}
            disabled={isSearching}
          >
            <Search size={14} aria-hidden />
            {isSearching ? 'Buscando...' : 'Buscar'}
          </button>
        )}
      </form>

      {patient && (
        <div className={style.result} role="status">
          <span className={style.avatar} aria-hidden>
            {getUserInitials(patientUser?.name ?? '')}
          </span>
          <div className={style.patientInfo}>
            <strong>{patientUser?.name ?? 'Paciente encontrado'}</strong>
            <span>CPF {cpf}</span>
          </div>
        </div>
      )}

      {patientNotFound && (
        <div className={style.notFound} role="status">
          <span className={style.notFoundText}>
            <UserRoundX size={16} aria-hidden />
            Nenhum paciente encontrado com esse CPF.
          </span>
          <button
            type="button"
            className={style.searchButton}
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
    </section>
  );
}

export { PatientLookup };
