import Sidebar from "./Sidebar";
import styles from "./Layout.module.css";
import { useSearch } from "../context/SearchContext";

const Layout = ({ children }) => {
  const { searchTerm, setSearchTerm } = useSearch();

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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {children}
      </div>
    </div>
  );
};

export default Layout;
