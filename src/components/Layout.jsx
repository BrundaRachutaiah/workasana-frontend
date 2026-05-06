import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import styles from "./Layout.module.css";
import { useSearch } from "../context/SearchContext";

const Layout = ({ children }) => {
  const { searchTerm, setSearchTerm } = useSearch();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 820px)");

    const apply = () => {
      setIsMobile(mq.matches);
      if (!mq.matches) setSidebarOpen(false);
    };

    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  return (
    <div className={styles.layout}>
      <Sidebar
        isOpen={sidebarOpen}
        onNavigate={isMobile ? () => setSidebarOpen(false) : undefined}
        showClose={isMobile}
        onClose={isMobile ? () => setSidebarOpen(false) : undefined}
      />

      {isMobile && sidebarOpen ? (
        <div
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      <div className={styles.main}>
        <div className={styles.topbar}>
          {isMobile ? (
            <button
              type="button"
              className={styles.menuBtn}
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Toggle menu"
              title="Menu"
            >
              ☰
            </button>
          ) : null}

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
