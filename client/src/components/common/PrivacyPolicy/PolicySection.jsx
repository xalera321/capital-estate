import styles from './PolicySection.module.scss';

export const PolicySection = ({ title, children }) => {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.content}>{children}</div>
    </section>
  );
};