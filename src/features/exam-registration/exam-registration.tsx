import { useState } from 'react';
import { SideBar } from '../../components/side-bar/side-bar-manager';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { ExamCard } from '../../components/exam-card/exam-card';
import { ExamDetailModal } from '../../components/exam-detail-modal/exam-detail-modal';
import { useCurrentUser } from '../../config/api/get-current-user';
import { useHealthUnitsByUserId } from '../../config/api/get-health-units-by-user-id';
import { useGetExamsByHealthUnitId } from '../../config/api/get-exams-by-health-unit-id';
import { SIDEBAR_MANAGER_ITEMS } from '../healt-unit-manager/constants';
import { ExamRegistrationForm } from './components/exam-registration-form/exam-registration-form';
import style from './exam-registration.module.scss';

function ExamRegistration() {
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const { data: user } = useCurrentUser();
  const { data: healthUnits } = useHealthUnitsByUserId(user?._id);

  const healthUnitId = healthUnits?.[0]?._id;
  const { data: exams } = useGetExamsByHealthUnitId(healthUnitId);

  return (
    <>
      <div className={style.container}>
        <SideBar
          items={SIDEBAR_MANAGER_ITEMS}
          pageTitle="Painel Manager"
          user={user}
        />
        <div className={style.mainContent}>
          <HeaderManager
            title="Exames"
            subtitle="Cadastre exames e vincule-os ao paciente pelo CPF"
            onButtonClick={() => {}}
            user={user}
          />

          <div className={style.content}>
            <ExamRegistrationForm />

            <div className={style.examListSection}>
              <h2>Exames cadastrados</h2>
              <div className={style.examGrid}>
                {exams?.length ? (
                  exams.map((exam) => (
                    <ExamCard
                      key={exam._id}
                      exam={exam}
                      onClick={() => setSelectedExamId(exam._id)}
                    />
                  ))
                ) : (
                  <p className={style.empty}>
                    Nenhum exame cadastrado ainda.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ExamDetailModal
        examId={selectedExamId}
        onClose={() => setSelectedExamId(null)}
      />
    </>
  );
}

export { ExamRegistration };
