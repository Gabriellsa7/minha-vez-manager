import { useState } from 'react';
import { SideBar } from '../../components/side-bar/side-bar-manager';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { HealthUnitSelect } from '../../components/health-unit-select/health-unit-select';
import { useCurrentUser } from '../../config/api/get-current-user';
import { useHealthUnitsByUserId } from '../../config/api/get-health-units-by-user-id';
import { useGetExamOfferingsByHealthUnitId } from '../../config/api/get-exam-offerings-by-health-unit-id';
import { SIDEBAR_MANAGER_ITEMS } from '../healt-unit-manager/constants';
import { ExamOfferingModal } from './components/exam-offering-modal/exam-offering-modal';
import { ExamOfferingDetailModal } from './components/exam-offering-detail-modal/exam-offering-detail-modal';
import { ExamOfferingCard } from './components/exam-offering-card/exam-offering-card';
import style from './exam-offering-manager.module.scss';
import type { IExamOffering } from '../../config/entities/exam-offering/exam-offering.entity';

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
      <div className={style.container}>
        <SideBar
          items={SIDEBAR_MANAGER_ITEMS}
          pageTitle="Painel Manager"
          user={user}
        />
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
          <div className={style.examOfferingSection}>
            {examOfferings?.length ? (
              examOfferings.map((examOffering) => (
                <ExamOfferingCard
                  key={examOffering._id}
                  examOffering={examOffering}
                  onView={() => setViewingOffering(examOffering)}
                  onEdit={() => openEditModal(examOffering)}
                />
              ))
            ) : (
              <p className={style.empty}>Nenhum exame cadastrado ainda.</p>
            )}
          </div>
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
