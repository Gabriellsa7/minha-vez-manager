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
    <div className={style.container}>
      <div className={style.cardContainer}>
        <div className={style.titleContainer}>
          <CirclePlus size={26} className={style.titleIcon} />
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
              <Icon size={20} />
              <span>{title}</span>
            </NavLink>
          </div>
        ))}
      </div>
      <div className={style.footer}>
        <ThemeToggle />
        <Profile user={user} />
      </div>
    </div>
  );
}

export { SideBar };
