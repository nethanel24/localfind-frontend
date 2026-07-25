import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faHouse } from "@fortawesome/free-solid-svg-icons";
import styles from "./NotFound.module.css";

const NotFound = () => (
  <div className={styles.wrap}>
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        <div className={styles.logoIcon}><FontAwesomeIcon icon={faLocationDot} /></div>
        LocalFind
      </Link>
    </nav>

    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.code}>
          <span className={styles.digitPrimary}>4</span>
          <span className={styles.digitLight}>0</span>
          <span className={styles.digitPrimary}>4</span>
        </div>

        <div className={styles.icon}><FontAwesomeIcon icon={faLocationDot} /></div>

        <div className={styles.title}>הדף לא נמצא</div>
        <div className={styles.sub}>הכתובת שחיפשת לא קיימת</div>

        <Link to="/" className={styles.btn}>
          <FontAwesomeIcon icon={faHouse} /> חזור לדף הבית
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;