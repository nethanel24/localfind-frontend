import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faMagnifyingGlass,
  faBriefcase,
} from "@fortawesome/free-solid-svg-icons";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext";
import type { UserRole } from "../../types";
import styles from "./Register.module.css";

const Register = () => {
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");

    if (!name.trim() || !email.trim() || !password) {
      setError("יש למלא את כל השדות");
      return;
    }
    if (password.length < 6) {
      setError("הסיסמה חייבת להכיל לפחות 6 תווים");
      return;
    }

    setLoading(true);
    try {
    await register(name, email, password, role);
    navigate(role === "provider" ? "/provider/onboarding" : "/feed");   
   } 
    catch (err: any) {
      setError(err.response?.data?.message || "ההרשמה נכשלה, נסה שוב");
    } 
    finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credential?: string) => {
    if (!credential) return;
    setError("");
    try {
await googleLogin(credential, role);
navigate(role === "provider" ? "/provider/onboarding" : "/feed");   
 } 
 catch (err: any) {
      setError(err.response?.data?.message || "ההרשמה עם גוגל נכשלה");
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
        <div className={styles.pageTitle}>הצטרף ל-LocalFind</div>
        <div className={styles.pageSub}>חיבור בין אנשים לשירותים בקרבת מקום</div>

        <div className={styles.formCard}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>שם מלא</label>
            <input
              className={styles.fieldInput}
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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

          <span className={styles.roleLabel}>אני מצטרף כ</span>
          <div className={styles.roleGrid}>
            <div
              className={`${styles.roleOption} ${
                role === "user" ? styles.roleOptionSelected : ""
              }`}
              onClick={() => setRole("user")}
            >
              <div className={styles.roleOptionIcon}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </div>
              <div className={styles.roleOptionLabel}>מחפש שירות</div>
            </div>

            <div
              className={`${styles.roleOption} ${
                role === "provider" ? styles.roleOptionSelected : ""
              }`}
              onClick={() => setRole("provider")}
            >
              <div className={styles.roleOptionIcon}>
                <FontAwesomeIcon icon={faBriefcase} />
              </div>
              <div className={styles.roleOptionLabel}>נותן שירות</div>
            </div>
          </div>

          {error && <div className={styles.errorText}>{error}</div>}

          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "נרשם..." : "הרשמה"}
          </button>

          <div className={styles.divider}>או</div>

          <div className={styles.googleWrap}>
            <GoogleLogin
              onSuccess={(res) => handleGoogleSuccess(res.credential)}
              onError={() => setError("ההרשמה עם גוגל נכשלה")}
            />
          </div>
        </div>

        <p className={styles.loginLink}>
          כבר רשום? <Link to="/login">התחבר</Link>
        </p>
      </div>
    </>
  );
};

export default Register;