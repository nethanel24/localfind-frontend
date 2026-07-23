import { useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faPhone, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchFavorites, removeFavorite } from "../../store/slices/favoritesSlice";
import { useGeolocation } from "../../hooks/useGeolocation";
import { getDistanceKm } from "../../utils/distance";
import { toWhatsappNumber } from "../../utils/phone";
import Navbar from "../../components/layout/Navbar/Navbar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import styles from "./Favorites.module.css";

const palettes = [
  { background: "var(--color-primary-light)", color: "var(--color-primary-medium)" },
  { background: "var(--amber-lt)", color: "var(--amber-dk)" },
  { background: "var(--purple-lt)", color: "var(--purple)" },
];

const KM_LABEL = String.fromCharCode(1511, 34, 1502);

const getInitials = (name: string) =>
  name.trim().split(" ").slice(0, 2).map((part) => part[0]).join(" ");

const Favorites = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.favorites);
  const { coords } = useGeolocation();

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const handleRemove = useCallback(
    (providerId: string) => {
      dispatch(removeFavorite(providerId));
    },
    [dispatch]
  );

  const handleRetry = useCallback(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  return (
    <>
      <Navbar />

      <div className={styles.page}>
        <div className={styles.pageTitle}>שמורים</div>
        <div className={styles.pageSub}>
          {items.length === 0 ? "אין ספקים שמורים" : items.length + " אנשי קשר שמורים"}
        </div>

        {loading && <LoadingSpinner message="טוען שמורים..." />}

        {!loading && error && <ErrorMessage message={error} onRetry={handleRetry} />}

        {!loading && !error && items.length === 0 && (
          <div className={styles.empty}>
            עדיין לא שמרת ספקים. אפשר לשמור מהעמוד הראשי.
          </div>
        )}

        {!loading &&
          !error &&
          items.map((provider, index) => {
            const phone = provider.user?.phone;
            const distance =
              coords && provider.location?.coordinates
                ? getDistanceKm(coords.lat, coords.lng, provider.location.coordinates[1], provider.location.coordinates[0])
                : null;

            return (
              <div key={provider._id} className={styles.card}>
                <div className={styles.avatar} style={palettes[index % 3]}>
                  {getInitials(provider.user?.name || "")}
                </div>

                <div className={styles.body}>
                  <div className={styles.name}>{provider.user?.name}</div>
                  <div className={styles.meta}>
                    {provider.category?.name}
                    {distance !== null && " · " + distance.toFixed(1) + " " + KM_LABEL}
                    {" · "}
                    <span className={styles.rating}>
                      <FontAwesomeIcon icon={faStar} /> {provider.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className={styles.side}>
                  <div className={styles.actions}>
                    {phone && (
                      <>
                        <a href={"https://wa.me/" + toWhatsappNumber(phone)} target="_blank" rel="noreferrer" className={styles.wa}><FontAwesomeIcon icon={faWhatsapp} /></a>
                        <a href={"tel:" + phone} className={styles.tel}><FontAwesomeIcon icon={faPhone} /></a>
                      </>
                    )}
                    <button className={styles.remove} onClick={() => handleRemove(provider._id)} title="הסר מהשמורים"><FontAwesomeIcon icon={faTrash} /></button>
                  </div>

                  <div className={styles.links}>
                    <Link to={"/providers/" + provider._id} className={styles.details}>פרטים</Link>
                    <Link to={"/providers/" + provider._id + "/reviews"} className={styles.review}>כתוב ביקורת</Link>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Favorites;