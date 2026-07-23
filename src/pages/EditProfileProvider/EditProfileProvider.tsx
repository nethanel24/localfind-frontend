import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import api from "../../services/api";
import { useFetch } from "../../hooks/useFetch";
import Navbar from "../../components/layout/Navbar/Navbar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import type { Provider } from "../../types";
import styles from "./EditProfileProvider.module.css";

const EditProfileProvider = () => {
  const { data: provider, loading, error } = useFetch<Provider>("/providers/profile");

  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("");
  const [openness, setOpenness] = useState(50);
  const [isActive, setIsActive] = useState(true);

  const [message, setMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!provider) return;
    setDescription(provider.description || "");
    setPrice(String(provider.price ?? ""));
    setCity(provider.city || "");
    setOpenness(provider.openness ?? 50);
    setIsActive(provider.isActive ?? true);
  }, [provider]);

  const handleSave = async () => {
    setSaveError("");
    setMessage("");

    if (description.trim().length < 10) {
      setSaveError("התיאור צריך להיות באורך 10 תווים לפחות");
      return;
    }
    if (!price || Number(price) < 0) {
      setSaveError("יש להזין מחיר תקין");
      return;
    }
    if (!city.trim()) {
      setSaveError("יש להזין עיר");
      return;
    }

    setBusy(true);
    try {
      await api.put("/providers/" + provider?._id, {
        description: description.trim(),
        price: Number(price),
        city: city.trim(),
        openness,
        isActive,
      });
      setMessage("הפרטים נשמרו");
    } catch (err: any) {
      setSaveError(err.response?.data?.message || "השמירה נכשלה");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <LoadingSpinner message="טוען את הפרופיל שלך..." />;
  if (error) return <Navigate to="/provider/onboarding" replace />;

  return (
    <>
      <Navbar />

      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>פרטי שירות</div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>מה אתה יכול לעשות? (בשפה חופשית)</label>
            <textarea className={styles.textarea} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className={styles.twoCols}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>מחיר לשעה</label>
              <input className={styles.input} type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>עיר</label>
              <input className={styles.input} type="text" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>פתיחות להצעות ({openness}%)</label>
            <input className={styles.slider} type="range" min="0" max="100" value={openness} onChange={(e) => setOpenness(Number(e.target.value))} />
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitle}>הגדרות</div>

          <div className={styles.toggleRow}>
            <div>
              <div className={styles.toggleText}>פרופיל פעיל</div>
              <div className={styles.toggleSub}>מופיע בתוצאות חיפוש</div>
            </div>
            <button className={isActive ? styles.toggleOn : styles.toggleOff} onClick={() => setIsActive(!isActive)} title="הפעל או כבה">
              <span className={styles.knob} />
            </button>
          </div>
        </div>

        {message && <div className={styles.successText}>{message}</div>}
        {saveError && <div className={styles.errorText}>{saveError}</div>}

        <button className={styles.saveBtn} onClick={handleSave} disabled={busy}>
          {busy ? "שומר..." : "שמור"}
        </button>
      </div>
    </>
  );
};

export default EditProfileProvider;