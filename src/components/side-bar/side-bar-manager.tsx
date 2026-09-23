import { CirclePlus } from 'lucide-react';
import type { SidebarItem } from '../../config/constants/side-bar-manager/side-bar-manager';
import style from './side-bar-manager.module.scss';
import { NavLink } from 'react-router-dom';
import type { IUser } from '../../config/entities/user/user.entity';
import { Profile } from '../profile/profile';
import { ThemeToggle } from '../theme-toggle/theme-toggle';

interface SideBarProps {
  items: SidebarItem[];
  pageTitle: string;
  user?: IUser;
}

function SideBar({ items, pageTitle, user }: SideBarProps) {
  return (
    <aside className={style.container}>
      <nav className={style.cardContainer} aria-label={pageTitle}>
        <div className={style.titleContainer}>
          <CirclePlus size={26} className={style.titleIcon} aria-hidden />
          <span>{pageTitle}</span>
        </div>
        {items.map(({ title, icon: Icon, path }) => (
          <div key={path} className={style.navCard}>
            <NavLink
              to={path}
              end
              className={({ isActive }) =>
                isActive ? style.activeItem : style.item
              }
            >
              <Icon size={20} aria-hidden />
              <span>{title}</span>
            </NavLink>
          </div>
        ))}
      </nav>
      <div className={style.footer}>
        <ThemeToggle />
        <Profile user={user} />
      </div>
    </aside>
  );
}

export { SideBar };
