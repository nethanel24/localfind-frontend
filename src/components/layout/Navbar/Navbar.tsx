import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faHouse, faUser, faStar } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../../context/AuthContext";
import styles from "./Navbar.module.css";

const getInitials = (name: string) =>
  name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        <div className={styles.logoIcon}>
          <FontAwesomeIcon icon={faLocationDot} />
        </div>
        LocalFind
      </Link>

      <div className={styles.links}>
        <NavLink
          to="/feed"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.linkActive : ""}`
          }
        >
          <FontAwesomeIcon icon={faHouse} /> בית
        </NavLink>
        <NavLink
          to="/favorites"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.linkActive : ""}`
          }
        >
          <FontAwesomeIcon icon={faStar} /> שמורים
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.linkActive : ""}`
          }
        >
          <FontAwesomeIcon icon={faUser} /> פרופיל
        </NavLink>
      </div>

      {user ? (
        <div className={styles.avatar}>{getInitials(user.name)}</div>
      ) : (
        <Link to="/login" className={styles.link}>
          התחבר
        </Link>
      )}
    </nav>
  );
};

export default Navbar;