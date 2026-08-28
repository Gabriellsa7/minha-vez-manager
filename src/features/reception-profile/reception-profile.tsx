import { SideBar } from '../../components/side-bar/side-bar-manager';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { useCurrentUser } from '../../config/api/get-current-user';
import { useHealthUnitById } from '../../config/api/get-health-unit-by-id';
import { getUserInitials } from '../../config/utils';
import { SIDEBAR_RECEPTION_ITEMS } from '../reception-appointments/constants';
import style from './reception-profile.module.scss';

function ReceptionProfile() {
  const { data: user } = useCurrentUser();
  const { data: healthUnit } = useHealthUnitById(user?.healthUnitId);

  return (
    <div className={style.container}>
      <SideBar
        items={SIDEBAR_RECEPTION_ITEMS}
        pageTitle="Painel de Recepção"
        user={user}
      />
      <div className={style.mainContent}>
        <HeaderManager
          title="Meu Perfil"
          subtitle="Suas informações de acesso ao painel de recepção"
          onButtonClick={() => {}}
          user={user}
        />

        {user && (
          <div className={style.content}>
            <div className={style.profileHeader}>
              <div className={style.profileImg}>
                <span>{getUserInitials(user.name)}</span>
              </div>
              <div>
                <strong>{user.name}</strong>
                <span className={style.role}>Recepção</span>
              </div>
            </div>

            <div className={style.infoGrid}>
              <div className={style.infoItem}>
                <span className={style.infoLabel}>E-mail</span>
                <span className={style.infoValue}>{user.email}</span>
              </div>
              <div className={style.infoItem}>
                <span className={style.infoLabel}>Unidade de saúde</span>
                <span className={style.infoValue}>
                  {healthUnit?.name ?? '--'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { ReceptionProfile };
