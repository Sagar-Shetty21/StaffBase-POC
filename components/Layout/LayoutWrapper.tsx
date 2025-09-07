import styles from "./LayoutWrapper.module.scss";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    return <nav className={styles.wrapper}>{children}</nav>;
};

export default LayoutWrapper;
