import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import styles from "./Login.module.css";

const Login = () => {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/feed";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");

    if (!email.trim() || !password) {
      setError("יש למלא אימייל וסיסמה");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      await login(data.token);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || "ההתחברות נכשלה, נסה שוב");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credential?: string) => {
    if (!credential) return;
    setError("");
    try {
      await googleLogin(credential);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || "ההתחברות עם גוגל נכשלה");
    }
  };

  return (
    <>
      <nav className={styles.navbar}>
        <Link to="/" className={styles.navbarLogo}>
          <div className={styles.navbarLogoIcon}>
            <FontAwesomeIcon icon={faLocationDot} />
          </div>
          LocalFind
        </Link>
      </nav>

      <div className={styles.page}>
        <div className={styles.pageTitle}>התחבר</div>
        <div className={styles.pageSub}>ברוך הבא חזרה</div>

        <div className={styles.formCard}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>אימייל</label>
            <input
              className={`${styles.fieldInput} ${styles.fieldInputLtr}`}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.field} style={{ marginBottom: 20 }}>
            <label className={styles.fieldLabel}>סיסמה</label>
            <input
              className={styles.fieldInput}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className={styles.errorText}>{error}</div>}

          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "מתחבר..." : "התחבר"}
          </button>

          <div className={styles.divider}>או</div>

          <div className={styles.googleWrap}>
            <GoogleLogin
              onSuccess={(res) => handleGoogleSuccess(res.credential)}
              onError={() => setError("ההתחברות עם גוגל נכשלה")}
            />
          </div>
        </div>

        <p className={styles.bottomLink}>
          לא רשום עדיין? <Link to="/register">הרשמה</Link>
        </p>
      </div>
    </>
  );
};

export default Login;