import type { FC } from 'react';
import styles from './contacts.module.scss';

export const ContactsUI: FC = () => {
  return (
    <>
      <h2 className="title">Контакты</h2>

      <div className={styles.contacts}>
        <div className="plainText gridColumnTitle">Адрес</div>
        <div className="plainText">430904, РМ, г. Саранск, п. Ялга, ул. Российская, д. 7</div>

        <div className="plainText gridColumnTitle">Почта</div>
        <a href="mailto:lab@estprm.mrsu.ru" className="plainText">
          <span className={styles.contactsLink}>lab@estprm.mrsu.ru </span>
        </a>

        <div className="plainText gridColumnTitle">Телефон</div>
        <a href="tel:+78342253995" className="plainText">
          <span className={styles.contactsLink}>+7 (834) 225-39-95</span>
        </a>
      </div>
      <div className={styles.contactsMap}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2610.2219619163347!2d45.126862928324705!3d54.13074112490471!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTTCsDA3JzUwLjciTiA0NcKwMDcnMzkuNSJF!5e1!3m2!1sru!2sru!4v1629319333337!5m2!1sru!2sru"
          className={styles.contactsMapFrame}
          title="Карта с месторасположением Лаборатории"
          aria-label="Карта с месторасположением Лаборатории"
        ></iframe>
      </div>
    </>
  );
};
