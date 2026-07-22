import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPen } from "@fortawesome/free-solid-svg-icons";
import api from "../../services/api";
import { useFetch } from "../../hooks/useFetch";
import { useGeolocation } from "../../hooks/useGeolocation";
import Navbar from "../../components/layout/Navbar/Navbar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import type { Category } from "../../types";
import styles from "./OnboardingProvider.module.css";

const OnboardingProvider = () => {
  const navigate = useNavigate();
  const { coords } = useGeolocation();
  const { data: categories } = useFetch<Category[]>("/categories");

  const [step, setStep] = useState(1);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("");
  const [detected, setDetected] = useState<Category | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [openness, setOpenness] = useState(50);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleDetect = async () => {
    setError("");
    if (description.trim().length < 10) {
      setError("התיאור צריך להיות באורך 10 תווים לפחות");
      return;
    }
    if (!price || Number(price) < 0) {
      setError("יש להזין מחיר תקין");
      return;
    }
    if (!city.trim()) {
      setError("יש להזין עיר");
      return;
    }

    setBusy(true);
    try {
      const { data } = await api.post("/providers/detect-category", {
        text: description.trim(),
      });
      setDetected(data.data);
      setCategoryId(data.data._id);
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || "זיהוי הקטגוריה נכשל");
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = async () => {
    setError("");
    if (!categoryId) {
      setError("יש לבחור קטגוריה");
      return;
    }
    if (!coords) {
      setError("צריך לאשר הרשאת מיקום כדי להמשיך");
      return;
    }

    setBusy(true);
    try {
      await api.post("/providers", {
        category: categoryId,
        description: description.trim(),
        price: Number(price),
        city: city.trim(),
        location: { type: "Point", coordinates: [coords.lng, coords.lat] },
        openness,
      });
      navigate("/provider/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "יצירת הפרופיל נכשלה");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className={styles.page}>
        <div className={styles.steps}>
          <div className={step >= 1 ? styles.stepActive : styles.step} />
          <div className={step >= 2 ? styles.stepActive : styles.step} />
          <div className={step >= 3 ? styles.stepActive : styles.step} />
        </div>

        {step === 1 && (
          <>
            <div className={styles.sectionTitle}>מה אתה יכול לעשות?</div>
            <div className={styles.sectionSub}>כתוב בחופשיות — נתרגם לקטגוריה אוטומטית</div>
            <textarea className={styles.freeInput} placeholder="למשל: מורה מתמטיקה, שיפוצים קלים, שמירה על כלבים..." value={description} onChange={(e) => setDescription(e.target.value)} />

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>מחיר לשעה</label>
                <input className={styles.fieldInput} type="number" min="0" placeholder="80" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>עיר</label>
                <input className={styles.fieldInput} type="text" placeholder="רמלה" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
            </div>

            {error && <div className={styles.errorText}>{error}</div>}

            <button className={styles.mainBtn} onClick={handleDetect} disabled={busy}>
              {busy ? "מזהה..." : "המשך לשלב הבא"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className={styles.sectionTitle}>זיהינו את הקטגוריה המתאימה</div>
            <div className={styles.sectionSub}>אפשר לאשר, או לבחור קטגוריה אחרת ידנית</div>

            <div className={styles.editSummary}>
              <div className={styles.editSummaryText}>{description}</div>
              <span className={styles.editSummaryEdit} onClick={() => setStep(1)}>
                <FontAwesomeIcon icon={faPen} /> ערוך
              </span>
            </div>

            {detected && (
              <div className={styles.suggestionCard}>
                <div className={styles.suggestionIcon}>
                  <FontAwesomeIcon icon={faCheck} />
                </div>
                <div className={styles.suggestionBody}>
                  <div className={styles.suggestionTitle}>{detected.name}</div>
                  <div className={styles.suggestionSub}>התאמה אוטומטית לפי מה שכתבת</div>
                </div>
              </div>
            )}

            <div className={styles.manualPick}>
              לא מדויק? בחר קטגוריה מהרשימה
              <select className={styles.manualSelect} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                <option value="">בחר קטגוריה...</option>
                {(categories || []).map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            {error && <div className={styles.errorText}>{error}</div>}

            <button className={styles.mainBtn} onClick={() => setStep(3)}>המשך</button>
          </>
        )}

        {step === 3 && (
          <>
            <div className={styles.sliderCard}>
              <div className={styles.sliderTitle}>כמה פתוח אתה להצעות חדשות?</div>
              <div className={styles.sliderSub}>נציע לך גם דברים שלא בחרת — לפי הגדרה זו</div>
              <input className={styles.slider} type="range" min="0" max="100" value={openness} onChange={(e) => setOpenness(Number(e.target.value))} />
              <div className={styles.sliderLabels}>
                <span>רק מה שבחרתי</span>
                <span>פתוח לכל הצעה</span>
              </div>
            </div>

            {error && <div className={styles.errorText}>{error}</div>}

            {busy ? (
              <LoadingSpinner message="יוצר פרופיל..." />
            ) : (
              <button className={styles.mainBtn} onClick={handleSubmit}>סיים והתחל לקבל בקשות</button>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default OnboardingProvider;