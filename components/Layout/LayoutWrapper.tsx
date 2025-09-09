import styles from "./LayoutWrapper.module.scss";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export default LayoutWrapper;
