import { Outlet } from 'react-router';
import { useCurrentUser } from '../../config/api/get-current-user';
import { resolveNavigation } from '../../config/constants/navigation/navigation';
import { SideBar } from '../side-bar/side-bar-manager';
import style from './app-layout.module.scss';

function AppLayout() {
  const { data: user } = useCurrentUser();
  const navigation = resolveNavigation(user);

  return (
    <div className={style.layout}>
      {navigation && (
        <SideBar
          items={navigation.items}
          pageTitle={navigation.title}
          user={user}
        />
      )}
      <main className={style.main}>
        <Outlet />
      </main>
    </div>
  );
}

export { AppLayout };
