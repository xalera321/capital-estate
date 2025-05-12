import styles from './LegalInfo.module.scss';

export const LegalInfo = ({ updateDate = "28 июня 2017 г." }) => {
  return (
    <div className={styles.legal}>
      <p className={styles.updateDate}>Обновлено {updateDate}</p>
    </div>
  );
};