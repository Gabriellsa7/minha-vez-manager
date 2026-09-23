import { useState } from 'react';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { HealthUnitSelect } from '../../components/health-unit-select/health-unit-select';
import { useCurrentUser } from '../../config/api/get-current-user';
import { useHealthUnitsByUserId } from '../../config/api/get-health-units-by-user-id';
import { useGetExamOfferingsByHealthUnitId } from '../../config/api/get-exam-offerings-by-health-unit-id';
import { ExamOfferingModal } from './components/exam-offering-modal/exam-offering-modal';
import { ExamOfferingDetailModal } from './components/exam-offering-detail-modal/exam-offering-detail-modal';
import { ExamOfferingCard } from './components/exam-offering-card/exam-offering-card';
import style from './exam-offering-manager.module.scss';
import type { IExamOffering } from '../../config/entities/exam-offering/exam-offering.entity';
import { EmptyState } from '../../components/empty-state/empty-state';
import { FlaskConical } from 'lucide-react';

function ExamOfferingManager() {
  const [openModal, setOpenModal] = useState(false);
  const [editingOffering, setEditingOffering] = useState<IExamOffering | null>(
    null
  );
  const [viewingOffering, setViewingOffering] = useState<IExamOffering | null>(
    null
  );
  const { data: user } = useCurrentUser();
  const { data: healthUnits } = useHealthUnitsByUserId(user?._id);
  const [selectedHealthUnitId, setSelectedHealthUnitId] = useState<string>();
  const healthUnitId = selectedHealthUnitId ?? healthUnits?.[0]?._id;

  const { data: examOfferings } = useGetExamOfferingsByHealthUnitId(
    healthUnitId,
    true
  );

  const openCreateModal = () => {
    setEditingOffering(null);
    setOpenModal(true);
  };

  const openEditModal = (examOffering: IExamOffering) => {
    setViewingOffering(null);
    setEditingOffering(examOffering);
    setOpenModal(true);
  };

  return (
    <>
      <div className={style.mainContent}>
        <HeaderManager
          title="Exames Disponíveis"
          subtitle="Cadastre os exames que sua unidade realiza"
          buttonText="Novo Exame"
          onButtonClick={openCreateModal}
          user={user}
        />
        <HealthUnitSelect
          healthUnits={healthUnits}
          value={healthUnitId}
          onChange={setSelectedHealthUnitId}
        />
        <div className={style.content}>
          {examOfferings?.length ? (
            <div className={style.examOfferingSection}>
              {examOfferings.map((examOffering) => (
                <ExamOfferingCard
                  key={examOffering._id}
                  examOffering={examOffering}
                  onView={() => setViewingOffering(examOffering)}
                  onEdit={() => openEditModal(examOffering)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={FlaskConical}
              title="Nenhum exame disponível"
              description="Cadastre os exames que a unidade realiza para liberar o agendamento pelo app e pela recepção."
            />
          )}
        </div>
      </div>
      <ExamOfferingModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        healthUnitId={healthUnitId}
        examOffering={editingOffering}
      />
      <ExamOfferingDetailModal
        examOffering={viewingOffering}
        onClose={() => setViewingOffering(null)}
        onEdit={openEditModal}
      />
    </>
  );
}

export { ExamOfferingManager };
