import { useState } from 'react';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { SideBar } from '../../components/side-bar/side-bar-manager';
import { useCurrentUser } from '../../config/api/get-current-user';
import { useHealthProfessionalById } from '../../config/api/get-health-professional-by-id';
import { SIDEBAR_PROFESSIONAL_MANAGER } from '../health-professional-manager/constants';
import { useGetPrescriptionsByProfessionalId } from './api/get-prescriptions-by-professional-id';
import { PrescriptionCard } from './components/prescription-card/prescription-card';
import { PrescriptionDetailModal } from './components/prescription-detail-modal/prescription-detail-modal';
import type { IPrescription } from '../../config/entities/prescription/prescription.entity';
import style from './health-professional-prescription.module.scss';

function HealthProfessionalPrescription() {
  const { data: user } = useCurrentUser();
  const { data: professional } = useHealthProfessionalById(user?._id);
  const { data: prescriptions, isLoading } = useGetPrescriptionsByProfessionalId(
    professional?._id
  );

  const [selectedPrescription, setSelectedPrescription] =
    useState<IPrescription | null>(null);

  return (
    <div className={style.container}>
      <SideBar
        pageTitle="Receitas"
        items={SIDEBAR_PROFESSIONAL_MANAGER}
        user={user}
      />
      <div className={style.mainContent}>
        <HeaderManager
          title="Receitas"
          subtitle="Histórico de receitas emitidas por você"
          onButtonClick={() => {}}
          user={user}
        />
        <div className={style.content}>
          {isLoading && <p className={style.emptyState}>Carregando...</p>}

          {!isLoading && prescriptions?.length === 0 && (
            <p className={style.emptyState}>
              Ainda não há prescrições. Use o botão &quot;Prescrever&quot;
              durante um atendimento para criar uma.
            </p>
          )}

          <div className={style.grid}>
            {prescriptions?.map((prescription) => (
              <PrescriptionCard
                key={prescription._id}
                prescription={prescription}
                onClick={() => setSelectedPrescription(prescription)}
              />
            ))}
          </div>
        </div>
      </div>

      {selectedPrescription && (
        <PrescriptionDetailModal
          prescription={selectedPrescription}
          onClose={() => setSelectedPrescription(null)}
        />
      )}
    </div>
  );
}

export { HealthProfessionalPrescription };
