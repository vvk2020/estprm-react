import type { FC } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './app-menu-item.module.scss';
import type { IAppMenuItemUIProps } from './type';

export const AppMenuItemUI: FC<IAppMenuItemUIProps> = (props: IAppMenuItemUIProps) => {
  return (
    <li className={styles.menuLinksListItem}>
      <NavLink
        className={({ isActive }) => (isActive ? 'link linkActive' : 'link')}
        to={props.to || '/'}
      >
        {props.text}
      </NavLink>
    </li>
  );
};
