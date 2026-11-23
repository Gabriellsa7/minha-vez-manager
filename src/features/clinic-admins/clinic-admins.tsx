import { useState } from 'react';
import { ShieldUser } from 'lucide-react';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { EmptyState } from '../../components/empty-state/empty-state';
import { useCurrentUser } from '../../config/api/get-current-user';
import { useClinicAdmins } from '../../config/api/get-clinic-admins';
import { getUserInitials } from '../../config/utils';
import { ClinicAdminModal } from './components/clinic-admin-modal/clinic-admin-modal';
import cardStyle from '../receptionists/components/receptionist-card/receptionist-card.module.scss';
import style from './clinic-admins.module.scss';

// Network administrator's page: the accounts of the clinic administrators, who then
// register their own health units, professionals and receptionists.
function ClinicAdmins() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: user } = useCurrentUser();
  const { data: admins, isLoading } = useClinicAdmins();

  return (
    <>
      <div className={style.mainContent}>
        <HeaderManager
          title="Administradores das clínicas"
          subtitle="Crie a conta de quem vai cadastrar a unidade, os profissionais e as recepcionistas"
          buttonText="Novo administrador"
          onButtonClick={() => setIsModalOpen(true)}
          user={user}
        />
        <div className={style.content}>
          {admins?.length ? (
            <div className={style.receptionistsSection}>
              {admins.map((admin) => (
                <div key={admin._id} className={cardStyle.card}>
                  <div className={cardStyle.profileImg}>
                    <span>{getUserInitials(admin.name)}</span>
                  </div>
                  <div className={cardStyle.content}>
                    <h3>{admin.name}</h3>
                    <div className={cardStyle.email}>
                      <span>{admin.email}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !isLoading && (
              <EmptyState
                icon={ShieldUser}
                title="Nenhum administrador de clínica"
                description="Cada clínica tem um administrador, que cadastra a unidade, os profissionais e as recepcionistas."
              />
            )
          )}
        </div>
      </div>
      <ClinicAdminModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

export { ClinicAdmins };
