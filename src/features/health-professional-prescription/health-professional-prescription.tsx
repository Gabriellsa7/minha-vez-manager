import { useState } from 'react';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { useCurrentUser } from '../../config/api/get-current-user';
import { useHealthProfessionalById } from '../../config/api/get-health-professional-by-id';
import { useGetPrescriptionsByProfessionalId } from './api/get-prescriptions-by-professional-id';
import { PrescriptionCard } from './components/prescription-card/prescription-card';
import { PrescriptionDetailModal } from './components/prescription-detail-modal/prescription-detail-modal';
import type { IPrescription } from '../../config/entities/prescription/prescription.entity';
import style from './health-professional-prescription.module.scss';
import { EmptyState } from '../../components/empty-state/empty-state';
import { ClipboardPlus } from 'lucide-react';

function HealthProfessionalPrescription() {
  const { data: user } = useCurrentUser();
  const { data: professional } = useHealthProfessionalById(user?._id);
  const { data: prescriptions, isLoading } =
    useGetPrescriptionsByProfessionalId(professional?._id);

  const [selectedPrescription, setSelectedPrescription] =
    useState<IPrescription | null>(null);

  return (
    <>
      <div className={style.mainContent}>
        <HeaderManager
          title="Receitas"
          subtitle="Histórico de receitas emitidas por você"
          user={user}
        />
        <div className={style.content}>
          {isLoading && <p className={style.loading}>Carregando...</p>}

          {!isLoading && !prescriptions?.length && (
            <EmptyState
              icon={ClipboardPlus}
              title="Nenhuma receita emitida"
              description="Use o botão “Prescrever” durante um atendimento para criar uma receita."
            />
          )}

          {Boolean(prescriptions?.length) && (
            <div className={style.grid}>
              {prescriptions?.map((prescription) => (
                <PrescriptionCard
                  key={prescription._id}
                  prescription={prescription}
                  onClick={() => setSelectedPrescription(prescription)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedPrescription && (
        <PrescriptionDetailModal
          prescription={selectedPrescription}
          onClose={() => setSelectedPrescription(null)}
        />
      )}
    </>
  );
}

export { HealthProfessionalPrescription };
