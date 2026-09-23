import { HeaderManager } from '../../../components/header-manager/header-manager';
import { useCurrentUser } from '../../../config/api/get-current-user';
import { usePatientLookup } from '../components/patient-lookup/hooks/use-patient-lookup';
import { PatientLookup } from '../components/patient-lookup/patient-lookup';
import style from '../reception.module.scss';
import { CheckInStatus } from './components/check-in-status';

function ReceptionCheckIn() {
  const { data: user } = useCurrentUser();
  const lookup = usePatientLookup();
  const patientId = lookup.patient?._id;

  return (
    <>
      <HeaderManager
        title="Check-in de Pacientes"
        subtitle="Busque o paciente pelo CPF e confirme a presença dele na unidade"
        user={user}
      />

      <div className={style.page}>
        <PatientLookup lookup={lookup} />
        {patientId && <CheckInStatus patientId={patientId} />}
      </div>
    </>
  );
}

export { ReceptionCheckIn };
