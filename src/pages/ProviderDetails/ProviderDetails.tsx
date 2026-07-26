import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faPhone, faMoneyBill, faLocationDot, faSlidersH } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useFetch } from "../../hooks/useFetch";
import { useGeolocation } from "../../hooks/useGeolocation";
import { getDistanceKm } from "../../utils/distance";
import { toWhatsappNumber } from "../../utils/phone";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import type { Provider, Review } from "../../types";
import styles from "./ProviderDetails.module.css";

const reviewPalettes = [
  { background: "var(--purple-lt)", color: "var(--purple)" },
  { background: "var(--amber-lt)", color: "var(--amber-dk)" },
  { background: "var(--color-primary-light)", color: "var(--color-primary-medium)" },
];

const KM_LABEL = String.fromCharCode(1511, 34, 1502);

const getInitials = (name: string) =>
  name.trim().split(" ").slice(0, 2).map((part) => part[0]).join(" ");

const ProviderDetails = () => {
  const { id } = useParams();
  const { coords } = useGeolocation();
  const { user } = useAuth();

  const { data: provider, loading, error, refetch } = useFetch<Provider>("/providers/" + id);
  const { data: reviews } = useFetch<Review[]>("/reviews?provider=" + id);

  const [requestText, setRequestText] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [requestError, setRequestError] = useState("");

  const handleSendRequest = async () => {
    setRequestError("");
    if (requestText.trim().length < 2) {
      setRequestError("יש לכתוב את הבקשה");
      return;
    }

    setSending(true);
    try {
      await api.post("/requests", { provider: id, text: requestText.trim() });
      setSent(true);
      setRequestText("");
    } catch (err: any) {
      setRequestError(err.response?.data?.message || "שליחת הבקשה נכשלה");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <LoadingSpinner message="טוען פרטי ספק..." />;
  if (error || !provider) return <ErrorMessage message={error || "הספק לא נמצא"} onRetry={refetch} />;

  const phone = provider.user?.phone;
  const distance =
    coords && provider.location?.coordinates
      ? getDistanceKm(coords.lat, coords.lng, provider.location.coordinates[1], provider.location.coordinates[0])
      : null;

  const waText = "היי, ראיתי אותך ב-LocalFind ואשמח לשמוע על השירות שלך";
  const waHref = phone ? "https://wa.me/" + toWhatsappNumber(phone) + "?text=" + encodeURIComponent(waText) : "";
  const telHref = phone ? "tel:" + phone : "";

  const canReview = user && user.role !== "provider";

  return (
    <>
      <nav className={styles.navbar}>
        <Link to="/feed" className={styles.back}>‹ חזרה</Link>
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}><FontAwesomeIcon icon={faLocationDot} /></div>
          LocalFind
        </Link>
      </nav>

      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.avatar}>{getInitials(provider.user?.name || "")}</div>
          <div className={styles.name}>{provider.user?.name}</div>
          <div className={styles.meta}>
            {provider.category?.name} · {provider.city}
            {distance !== null && " · " + distance.toFixed(1) + " " + KM_LABEL}
          </div>
          <div className={styles.rating}>
            <FontAwesomeIcon icon={faStar} /> {provider.rating.toFixed(1)} ({provider.reviewCount} ביקורות)
          </div>
        </div>

        {phone && (
          <div className={styles.ctaSection}>
            <a href={waHref} target="_blank" rel="noreferrer" className={styles.ctaWa}><FontAwesomeIcon icon={faWhatsapp} /> וואטסאפ</a>
            <a href={telHref} className={styles.ctaTel}><FontAwesomeIcon icon={faPhone} /> חייג</a>
          </div>
        )}

        <div className={styles.infoCard}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}><FontAwesomeIcon icon={faMoneyBill} /> מחיר לשעה</span>
            <span className={styles.infoValueGreen}>{provider.price} ₪</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}><FontAwesomeIcon icon={faLocationDot} /> אזור</span>
            <span className={styles.infoValue}>{provider.city}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}><FontAwesomeIcon icon={faSlidersH} /> פתיחות להצעות</span>
            <span className={styles.infoValue}>{provider.openness}%</span>
          </div>
        </div>

        <div className={styles.infoCard}>
          <p className={styles.bio}>{provider.description}</p>
        </div>

        {canReview && (
          <div className={styles.infoCard}>
            <div className={styles.sectionTitle}>שלח בקשה</div>
            {sent ? (
              <div className={styles.sentNote}>הבקשה נשלחה, הספק יראה אותה בלוח שלו</div>
            ) : (
              <>
                <textarea
                  className={styles.requestInput}
                  placeholder="כתוב מה אתה צריך ומתי"
                  value={requestText}
                  onChange={(e) => setRequestText(e.target.value)}
                />
                {requestError && <div className={styles.errorText}>{requestError}</div>}
                <button className={styles.requestBtn} onClick={handleSendRequest} disabled={sending}>
                  {sending ? "שולח..." : "שלח בקשה"}
                </button>
              </>
            )}
          </div>
        )}

        <div className={styles.reviewsHeader}>
          <div className={styles.sectionTitle}>ביקורות</div>
          {canReview && (
            <Link to={"/providers/" + id + "/reviews"} className={styles.writeReview}>
              כתוב ביקורת
            </Link>
          )}
        </div>

        {(reviews || []).length === 0 ? (
          <div className={styles.empty}>אין עדיין ביקורות</div>
        ) : (
          (reviews || []).map((review, index) => (
            <div key={review._id} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <div className={styles.reviewAvatar} style={reviewPalettes[index % 3]}>
                  {getInitials(review.user?.name || "")}
                </div>
                <span className={styles.reviewName}>{review.user?.name}</span>
                <span className={styles.reviewStars}>
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <FontAwesomeIcon key={i} icon={faStar} />
                  ))}
                </span>
              </div>
              {review.comment && <div className={styles.reviewText}>{review.comment}</div>}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default ProviderDetails;