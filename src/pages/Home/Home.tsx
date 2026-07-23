import { Link, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import styles from "./Home.module.css";

const Home = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner message="טוען..." />;

  if (user) {
    if (user.role === "provider") return <Navigate to="/provider/dashboard" replace />;
    if (user.role === "admin") return <Navigate to="/admin/stats" replace />;
    return <Navigate to="/feed" replace />;
  }

  return (
    <div className={styles.wrap}>
      <nav className={styles.navbar}>
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}><FontAwesomeIcon icon={faLocationDot} /></div>
          LocalFind
        </Link>
      </nav>

      <section className={styles.hero}>
        <div className={styles.badge}>
          <FontAwesomeIcon icon={faLocationDot} /> שירותים קרובים אליך
        </div>

        <h1 className={styles.title}>
          מצא <span className={styles.titleAccent}>בעל מקצוע</span> קרוב אליך — עכשיו
        </h1>

        <p className={styles.subtitle}>
          כתוב מה אתה צריך ותוך שניות תקבל רשימה של אנשים זמינים קרוב אליך
        </p>

        <div className={styles.actions}>
          <Link to="/register" className={styles.btnPrimary}>הירשם</Link>
          <Link to="/login" className={styles.btnSecondary}>התחבר</Link>
        </div>
      </section>

      <footer className={styles.footer}>© 2026 LocalFind</footer>
    </div>
  );
};

export default Home;