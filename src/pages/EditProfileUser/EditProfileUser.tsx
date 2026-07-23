import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/layout/Navbar/Navbar";
import styles from "./EditProfileUser.module.css";

const getInitials = (name: string) =>
  name.trim().split(" ").slice(0, 2).map((part) => part[0]).join(" ");

const EditProfileUser = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const fileInput = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [imgUrl, setImgUrl] = useState(user?.imgUrl || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handlePickImage = async (file?: File) => {
    if (!file) return;
    setError("");
    setBusy(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await api.post("/file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImgUrl(data.url);
      setMessage("התמונה הועלתה, לחץ שמור כדי לשמור אותה");
    } catch (err: any) {
      setError(err.response?.data?.message || "העלאת התמונה נכשלה");
    } finally {
      setBusy(false);
    }
  };

  const handleSave = async () => {
    setError("");
    setMessage("");

    if (name.trim().length < 2) {
      setError("שם חייב להכיל לפחות 2 תווים");
      return;
    }
    if (phone && (phone.length < 9 || phone.length > 15)) {
      setError("מספר טלפון לא תקין");
      return;
    }

    setBusy(true);
    try {
      await api.put("/users/profile", {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        imgUrl,
      });

      if (currentPassword && newPassword) {
        await api.put("/users/change-password", { currentPassword, newPassword });
        setCurrentPassword("");
        setNewPassword("");
      }

      await refreshUser();
      setMessage("הפרטים נשמרו");
    } catch (err: any) {
      setError(err.response?.data?.message || "השמירה נכשלה");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("למחוק את החשבון? הפעולה אינה הפיכה.")) return;

    try {
      await api.delete("/users/account");
      logout();
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "מחיקת החשבון נכשלה");
    }
  };

  return (
    <>
      <Navbar />

      <div className={styles.page}>
        <div className={styles.avatarSection}>
          <div className={styles.avatarWrap}>
            {imgUrl ? (
              <img className={styles.avatarImg} src={imgUrl} alt={name} />
            ) : (
              <div className={styles.avatar}>{getInitials(name || "")}</div>
            )}
            <button className={styles.avatarBtn} onClick={() => fileInput.current?.click()} title="החלף תמונה">
              <FontAwesomeIcon icon={faCamera} />
            </button>
          </div>
          <input className={styles.hiddenInput} type="file" accept="image/*" ref={fileInput} onChange={(e) => handlePickImage(e.target.files?.[0])} />
          <div className={styles.avatarName}>{name}</div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitle}>פרטים אישיים</div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>שם מלא</label>
            <input className={styles.fieldInput} type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>אימייל</label>
            <input className={`${styles.fieldInput} ${styles.ltr}`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>טלפון</label>
            <input className={`${styles.fieldInput} ${styles.ltr}`} type="tel" placeholder="0500000000" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitle}>שינוי סיסמה</div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>סיסמה נוכחית</label>
            <input className={styles.fieldInput} type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>סיסמה חדשה</label>
            <input className={styles.fieldInput} type="password" placeholder="לפחות 6 תווים" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
        </div>

        {message && <div className={styles.successText}>{message}</div>}
        {error && <div className={styles.errorText}>{error}</div>}

        <button className={styles.saveBtn} onClick={handleSave} disabled={busy}>
          {busy ? "שומר..." : "שמור שינויים"}
        </button>

        <button className={styles.deleteBtn} onClick={handleDelete}>מחק חשבון</button>
      </div>
    </>
  );
};

export default EditProfileUser;