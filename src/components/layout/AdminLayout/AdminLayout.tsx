import type { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faChartBar, faTag, faUsers, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../../context/AuthContext";
import styles from "./AdminLayout.module.css";

const getInitials = (name: string) =>
  name.trim().split(" ").slice(0, 2).map((part) => part[0]).join("");

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.item} ${isActive ? styles.itemActive : ""}`;

  return (
    <>
      <nav className={styles.navbar}>
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}><FontAwesomeIcon icon={faLocationDot} /></div>
          LocalFind
          <span className={styles.badge}>Admin</span>
        </Link>
        <div className={styles.avatar}>{getInitials(user?.name || "")}</div>
      </nav>

      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <NavLink to="/admin/stats" className={linkClass}>
            <FontAwesomeIcon icon={faChartBar} /> סטטיסטיקות
          </NavLink>
          <NavLink to="/admin/categories" className={linkClass}>
            <FontAwesomeIcon icon={faTag} /> קטגוריות
          </NavLink>
          <NavLink to="/admin/users" className={linkClass}>
            <FontAwesomeIcon icon={faUsers} /> משתמשים
          </NavLink>
          <div className={styles.spacer} />
          <button className={styles.logout} onClick={handleLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} /> יציאה
          </button>
        </div>

        <div className={styles.main}>{children}</div>
      </div>
    </>
  );
};

export default AdminLayout;