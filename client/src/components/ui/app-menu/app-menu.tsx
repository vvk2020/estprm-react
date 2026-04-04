import type { FC } from 'react';
import { AppMenuItemUI } from '../app-menu-item/app-menu-item';
import styles from './app-menu.module.scss';

export const AppMenuUI: FC = () => {
  return (
    <nav className={styles.menu}>
      <ul className={styles.menuLinksList}>
        <AppMenuItemUI text="Главная" />
        <AppMenuItemUI text="Цели и задачи" to="/goals" />
        <AppMenuItemUI text="Структура" to="/structure" />
        <AppMenuItemUI text="Оснащение" to="/equipment" />
        <AppMenuItemUI text="Разработки" to="/developments" />
        <AppMenuItemUI text="Публикации" to="/publications" />
        <AppMenuItemUI text="Контакты" to="/contacts" />
        <AppMenuItemUI text="Вход" to="/login" />
      </ul>
    </nav>
  );
};
