import styles from "./LoadingOverlay.module.css";

export const InlineSpinner = ({ title = "Loading" }) => (
  <span className={styles.inlineSpinner} aria-label={title} title={title} />
);

const LoadingOverlay = ({ show, label = "Loading…" }) => {
  if (!show) return null;

  return (
    <div className={styles.overlay} role="status" aria-live="polite">
      <div className={styles.card}>
        <div className={styles.spinner} />
        <div>{label}</div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
