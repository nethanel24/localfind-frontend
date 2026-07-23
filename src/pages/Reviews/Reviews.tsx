import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import api from "../../services/api";
import { useFetch } from "../../hooks/useFetch";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import type { Provider } from "../../types";
import styles from "./Reviews.module.css";

const getInitials = (name: string) =>
  name.trim().split(" ").slice(0, 2).map((part) => part[0]).join(" ");

const Reviews = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: provider, loading, error, refetch } = useFetch<Provider>("/providers/" + id);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    setSubmitError("");

    if (rating < 1) {
      setSubmitError("יש לבחור דירוג");
      return;
    }

    setSending(true);
    try {
      await api.post("/reviews/add", { provider: id, rating, comment: comment.trim() });
      navigate("/providers/" + id);
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || "שליחת הביקורת נכשלה");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <LoadingSpinner message="טוען..." />;
  if (error || !provider) return <ErrorMessage message={error || "הספק לא נמצא"} onRetry={refetch} />;

  return (
    <>
      <nav className={styles.navbar}>
        <Link to={"/providers/" + id} className={styles.back}>‹ חזרה</Link>
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}><FontAwesomeIcon icon={faLocationDot} /></div>
          LocalFind
        </Link>
      </nav>

      <div className={styles.page}>
        <div className={styles.rateCard}>
          <div className={styles.avatar}>{getInitials(provider.user?.name || "")}</div>
          <div className={styles.name}>{provider.user?.name}</div>
          <div className={styles.meta}>{provider.category?.name} · {provider.city}</div>

          <div className={styles.prompt}>איך היה השירות?</div>

          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((value) => (
              <button key={value} className={value <= rating ? styles.starSelected : styles.star} onClick={() => setRating(value)} title={value + " כוכבים"}>
                <FontAwesomeIcon icon={faStar} />
              </button>
            ))}
          </div>

          <textarea className={styles.textarea} placeholder="ספר על החוויה שלך (אופציונלי)..." value={comment} onChange={(e) => setComment(e.target.value)} maxLength={500} />

          {submitError && <div className={styles.errorText}>{submitError}</div>}

          <button className={styles.submitBtn} onClick={handleSubmit} disabled={sending}>
            {sending ? "שולח..." : "שלח ביקורת"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Reviews;