import { useState } from 'react';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { useCurrentUser } from '../../config/api/get-current-user';
import { HealthProfessionalModal } from './components/health-professional-modal/health-professional-modal';
import style from './profissionals.module.scss';
import { useHealthProfessionalsByUserId } from '../../config/api/get-health-professionals-by-user-id';
import { HealthProfessionalCard } from './components/health-professional-card/health-professional-card';
import { HealthProfessionalDetailModal } from './components/health-professional-detail-modal/health-professional-detail-modal';
import { EmptyState } from '../../components/empty-state/empty-state';
import { Stethoscope } from 'lucide-react';

function Professionals() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<
    string | null
  >(null);
  const { data: user } = useCurrentUser();

  const { data: healthProfessionals, isLoading } =
    useHealthProfessionalsByUserId(user?._id);
  const selectedProfessional =
    healthProfessionals?.find(
      (professional) => professional._id === selectedProfessionalId
    ) ?? null;

  return (
    <>
      <div className={style.mainContent}>
        <HeaderManager
          title="Profissionais"
          subtitle="Gerencie os profissionais das suas unidades"
          buttonText="Novo profissional"
          onButtonClick={() => setIsModalOpen(true)}
        />
        <div className={style.content}>
          {healthProfessionals?.length ? (
            <div className={style.professionalsSection}>
              {healthProfessionals.map((professional) => (
                <HealthProfessionalCard
                  key={professional._id}
                  healthProfessional={professional}
                  onClick={() => setSelectedProfessionalId(professional._id)}
                />
              ))}
            </div>
          ) : (
            !isLoading && (
              <EmptyState
                icon={Stethoscope}
                title="Nenhum profissional cadastrado"
                description="Adicione médicos e profissionais de exame para que eles possam atender pelas filas."
              />
            )
          )}
        </div>
      </div>
      <HealthProfessionalModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      {selectedProfessional && (
        <HealthProfessionalDetailModal
          key={selectedProfessional._id}
          healthProfessional={selectedProfessional}
          onClose={() => setSelectedProfessionalId(null)}
        />
      )}
    </>
  );
}

export { Professionals };
