import { Link, NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faHouse, faUser, faStar, faBell, faGear, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../../context/AuthContext";
import styles from "./Navbar.module.css";

const getInitials = (name: string) =>
  name.trim().split(" ").slice(0, 2).map((part) => part[0]).join("");

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isProvider = user?.role === "provider";

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.link} ${isActive ? styles.linkActive : ""}`;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        <div className={styles.logoIcon}>
          <FontAwesomeIcon icon={faLocationDot} />
        </div>
        LocalFind
      </Link>

      <div className={styles.links}>
        {isProvider ? (
          <>
            <NavLink to="/provider/dashboard" className={linkClass}>
              <FontAwesomeIcon icon={faBell} /> בקשות
            </NavLink>
            <NavLink to="/provider/profile" className={linkClass}>
              <FontAwesomeIcon icon={faUser} /> פרופיל
            </NavLink>
            <NavLink to="/profile" className={linkClass}>
              <FontAwesomeIcon icon={faGear} /> פרטים אישיים
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/feed" className={linkClass}>
              <FontAwesomeIcon icon={faHouse} /> בית
            </NavLink>
            <NavLink to="/favorites" className={linkClass}>
              <FontAwesomeIcon icon={faStar} /> שמורים
            </NavLink>
            <NavLink to="/profile" className={linkClass}>
              <FontAwesomeIcon icon={faUser} /> פרופיל
            </NavLink>
          </>
        )}
      </div>

      {user ? (
        <div className={styles.userArea}>
          <div className={styles.avatar}>{getInitials(user.name)}</div>
          <button className={styles.logout} onClick={handleLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} /> יציאה
          </button>
        </div>
      ) : (
        <Link to="/login" className={styles.link}>
          התחבר
        </Link>
      )}
    </nav>
  );
};

export default Navbar;