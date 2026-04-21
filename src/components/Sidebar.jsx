import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: "⊞" },
    { to: "/projects",  label: "Projects",  icon: "☰" },
    { to: "/teams",     label: "Teams",     icon: "◎" },
    { to: "/reports",   label: "Reports",   icon: "↗" },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>workasana</div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ""}`
            }
          >
            <span className={styles.icon}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.bottom}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className={styles.userDetails}>
            <span className={styles.userName}>{user?.name}</span>
            <span className={styles.userEmail}>{user?.email}</span>
          </div>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;