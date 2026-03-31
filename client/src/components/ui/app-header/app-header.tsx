import type { FC } from 'react';
import styles from './app-header.module.scss';
import type { TAppHeaderUIProps } from './type';

export const AppHeaderUI: FC<TAppHeaderUIProps> = () => (
  <header className={styles.header}>
    <h1>ВСЁ ПОЛУЧИТСЯ!</h1>
    <nav className={`${styles.menu}`}>ABC</nav>
  </header>
);
