import type { FC } from 'react';
import styles from './equipment.module.scss';

export const EquipmentUI: FC = () => {
  return (
    <>
      <h2 className="title">Оснащение</h2>

      <section className={styles.appliance}>
        <h3 className="subtitle">Материально-техническое оснащение</h3>
        <div className="plainText">
          Началом формирования материально-технической базы можно считать приобретение в 2000 году
          лабораторной установки с мембранными керамическими элементами TAMI Deutschland GmbH,
          определившей начальное научное направление ее развития - мембранное разделение и
          концентрирование жидких сред. Существенному расширению материально-технической базы
          Лаборатории способствовала Программа развития ФГБОУ ВО «МГУ им. Н.П. Огарёва», принятая на
          период 2010 - 2020 гг. В настоящее время Лаборатория оснащена высокотехнологичным
          экструзионным, литьевым, мембранным, измельчающим, диспергирующим, измерительным и другими
          видами оборудования и ведущих западных и отечественных компаний:
        </div>
        <div className={styles.equipmentImageContainer}>
          <img className={styles.equipmentImage} src="images/appliance.webp" alt="Фото института" />
        </div>
        <ol className="ulist">
          <li className="plainText ulistItem">
            Экструзионный комплекс HAAKE PolyLab OS (блок привода и измерений RheoDrive 7 OS,
            двухшнековый экструдер CTW100 OS, одношнековый экструдер Rheomex 19/25,
            экструдер-компаундер PTW16 и смеситель Rheomix 600 OS)
          </li>
          <li className="plainText ulistItem">Вертикальный термопластавтомат Babyplast 6/10VP</li>
          <li className="plainText ulistItem">
            Универсальная испытательная машина UAI-7000 М с термокамерой
          </li>
          <li className="plainText ulistItem">
            Установка с керамическими мембранами TAMI Deutschland GmbH
          </li>
          <li className="plainText ulistItem">
            Мембранная установка Alfa Laval LabUnit M20 с плоскими листовыми мембранами
          </li>
          <li className="plainText ulistItem">
            Мембранная установка Alfa Laval PilotUnit 2.5" RO/NF со спиральными мембранами
          </li>
          <li className="plainText ulistItem">Реометр HAAKE MARS III</li>
          <li className="plainText ulistItem">Ротационный вискозиметр HAAKE VT550</li>
          <li className="plainText ulistItem">
            Планетарная шаровая мельница PULVERISETTE 7 Premium Line
          </li>
          <li className="plainText ulistItem">Микротвердомер MicroUIRHD</li>
          <li className="plainText ulistItem">Лазерный анализатор микрочастиц «Ласка-1К»</li>
          <li className="plainText ulistItem">Мельница ножевая РМ 120</li>
          <li className="plainText ulistItem">Дробилка валковая ДВГ 200х125</li>
          <li className="plainText ulistItem">Вибрационная конусная мельница-дробилка ВКДМ 6</li>
          <li className="plainText ulistItem">Анализатор вибрационный лабораторный А20</li>
          <li className="plainText ulistItem">Вакуумный сушильный шкаф Binder VD 23</li>
          <li className="plainText ulistItem">Анализатор влажности «ЭВЛАС-2М»</li>
          <li className="plainText ulistItem">
            Система управления экспериментальными исследованиями на базе технологий NI PXI
          </li>
          <li className="plainText ulistItem">
            Измеритель плотности жидкостей вибрационный ВИП-2М
          </li>
          <li className="plainText ulistItem">Аппарат ультразвуковой</li>
          <li className="plainText ulistItem">Цифровой микроскоп</li>
          <li className="plainText ulistItem">
            чебное оборудование по процессам и аппаратам перерабатывающих производств
          </li>
        </ol>
      </section>

      <section className={styles.equipmentSoftware}>
        <h3 className="subtitle">Программное обеспечение</h3>
        <div className="plainText">
          Многолетний опыт научных исследований показывает высокую эффективность применения
          программного обеспечения для численного и твердотельного моделирования, позволяющего
          существенного сократить их объем и длительность. В процессе исследований сотрудниками
          Лаборатории используются различные виды лицензионного программного обеспечения,
          установленного, в том числе, на университетском кластере:
        </div>
        <div className={styles.equipmentImageContainer}>
          <img className={styles.equipmentImage} src="images/software.webp" alt="Фото института" />
        </div>
        <ol className="ulist">
          <li className="plainText ulistItem">
            ANSYS – универсальная программная система численного анализа с применением технологий
            высокопроизводительных вычислений. Позволяет решать линейные и нелинейные, стационарные
            и нестационарные пространственные задачи механики деформируемого твёрдого тела и
            механики конструкций (включая нестационарные геометрически и физически нелинейные задачи
            контактного взаимодействия элементов конструкций), задачи механики жидкости и газа,
            теплопередачи и теплообмена, электродинамики, акустики, а также механики связанных полей
          </li>
          <li className="plainText ulistItem">
            T-FLEX (T-FLEX CAD 3D, T-FLEX Анализ, T-FLEX Динамика) – система автоматизированного
            проектирования с возможностями параметрического 2D и 3D моделирования и разработки
            конструкторской документации в соответствии с ЕСКД и зарубежными стандартами
          </li>
          <li className="plainText ulistItem">
            NI LabVIEW – среда разработки систем сбора и обработки данных (в том числе систем
            управления техническими объектами и технологическими процессами) с использованием
            графического языка программирования G компании National Instruments
          </li>
          <li className="plainText ulistItem">
            MATLAB — пакет прикладных программ для решения задач технических вычислений
          </li>
          <li className="plainText ulistItem">
            KOMPAS 3D – система-стандарт 3D-проектирования изделий основного и вспомогательного
            производств в различных отраслях промышленности России и стран СНГ
          </li>
        </ol>
      </section>
    </>
  );
};
