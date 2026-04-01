import clsx from 'clsx';
import type { FC } from 'react';
import styles from './app-header.module.scss';
import type { TAppHeaderUIProps } from './type';

export const AppHeaderUI: FC<TAppHeaderUIProps> = () => (
  <header className={styles.header}>
    {/* Анимированные шестеренки */}
    <div className={styles.gears}>
      <div className={clsx(styles.gear, styles.gearLarge)}>
        <img src="svg/gear-large.svg" className="gearLargeSvg" alt="Большая шестеренка" />
      </div>
    </div>

    <div className={styles.logo}>
      <img src="svg/logo.svg" className={styles.logoSvg} alt="Логотип системы" />
    </div>
    <div className={styles.textBlock}>
      <h1 className={styles.title}>
        <span className={styles.titleFirstRow}>Лаборатория технологий</span>
        <span className={clsx(styles.titleFirstRow, styles.titleSecondRow)}>
          переработки сырья и материалов
        </span>
      </h1>
      <div className={styles.subTitle}>
        Любая достаточно развитая технология неотличима от волшебства | Артур Кларк
      </div>
    </div>
  </header>
);
