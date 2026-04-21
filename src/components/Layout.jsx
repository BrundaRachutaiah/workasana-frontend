import Sidebar from "./Sidebar";
import styles from "./Layout.module.css";

const Layout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Sidebar />

      <div className={styles.main}>
        {/* 🔥 TOP BAR */}
        <div className={styles.topbar}>
          <input
            type="text"
            placeholder="Search"
            className={styles.search}
          />
        </div>

        {children}
      </div>
    </div>
  );
};

export default Layout;