import { Outlet } from 'react-router-dom';
import { AppHeader } from '../../app-header';
import styles from './layout.module.scss';

/** ОБЕРТКА  ДЛЯ КОНТЕНТА СТРАНИЦЫ */
export const Layout = () => (
  <>
    <AppHeader />
    <div className={styles.container}>
      <Outlet />
    </div>
  </>
);
