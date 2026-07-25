import { SideBar } from '../../components/side-bar/side-bar-manager';
import { useCurrentUser } from '../../config/api/get-current-user';
import { SIDEBAR_MANAGER_ITEMS } from '../healt-unit-manager/constants';
import style from './profissionals.module.scss';

function Professionals() {
  const { data: user } = useCurrentUser();

  return (
    <div className={style.container}>
      <SideBar
        items={SIDEBAR_MANAGER_ITEMS}
        pageTitle="Painel Manager"
        user={user}
      />
      <div>
        <span>Professionals</span>
      </div>
    </div>
  );
}

export { Professionals };
