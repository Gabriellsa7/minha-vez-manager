import { HeaderManager } from '../../../components/header-manager/header-manager';
import { useCurrentUser } from '../../../config/api/get-current-user';
import { useHealthUnitById } from '../../../config/api/get-health-unit-by-id';
import { getUserInitials } from '../../../config/utils';
import pageStyle from '../reception.module.scss';
import style from './reception-profile.module.scss';

function ReceptionProfile() {
  const { data: user } = useCurrentUser();
  const { data: healthUnit } = useHealthUnitById(user?.healthUnitId);

  return (
    <>
      <HeaderManager
        title="Meu Perfil"
        subtitle="Suas informações de acesso ao painel de recepção"
        user={user}
      />

      {user && (
        <div className={pageStyle.page}>
          <section className={style.card}>
            <div className={style.profileHeader}>
              <span className={style.avatar} aria-hidden>
                {getUserInitials(user.name)}
              </span>
              <div className={style.identity}>
                <strong>{user.name}</strong>
                <span>Recepção</span>
              </div>
            </div>

            <dl className={style.infoGrid}>
              <div className={style.infoItem}>
                <dt>E-mail</dt>
                <dd>{user.email}</dd>
              </div>
              <div className={style.infoItem}>
                <dt>Unidade de saúde</dt>
                <dd>{healthUnit?.name ?? '—'}</dd>
              </div>
            </dl>
          </section>
        </div>
      )}
    </>
  );
}

export { ReceptionProfile };
