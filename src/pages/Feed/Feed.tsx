import { useState, useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchProviders, searchProviders } from "../../store/slices/providersSlice";
import { useGeolocation } from "../../hooks/useGeolocation";
import Navbar from "../../components/layout/Navbar/Navbar";
import ProviderCard from "../../components/ProviderCard/ProviderCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import styles from "./Feed.module.css";
import { fetchFavorites, addFavorite, removeFavorite } from "../../store/slices/favoritesSlice";
import { useAuth } from "../../context/AuthContext";

const Feed = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error, matchedCategory } = useAppSelector(
    (state) => state.providers
  );
  const { coords, ready } = useGeolocation();
  const { user } = useAuth();
  const favoriteIds = useAppSelector((state) => state.favorites.ids);

  const [text, setText] = useState("");

  // Load the initial list once we know whether we have the user's location
  useEffect(() => {
    if (ready) dispatch(fetchProviders(coords));
  }, [ready, coords, dispatch]);
  useEffect(() => {
    if (user) dispatch(fetchFavorites());
  }, [user, dispatch]);

  const handleToggleFavorite = useCallback(
    (providerId: string) => {
      if (favoriteIds.includes(providerId)) {
        dispatch(removeFavorite(providerId));
      } else {
        dispatch(addFavorite(providerId));
      }
    },
    [favoriteIds, dispatch]
  );

  const handleSearch = useCallback(() => {
    if (text.trim().length < 2) {
      dispatch(fetchProviders(coords));
      return;
    }
    dispatch(searchProviders({ text: text.trim(), coords }));
  }, [text, coords, dispatch]);

  const handleRetry = useCallback(() => {
    dispatch(fetchProviders(coords));
  }, [coords, dispatch]);

  return (
    <>
      <Navbar />

      <div className={styles.page}>
        <div className={styles.searchWrap}>
          <div className={styles.searchLabel}>מה אתה צריך?</div>
          <div className={styles.searchSub}>
            כתוב בחופשיות — נמצא מישהו קרוב אליך
          </div>
          <div className={styles.searchRow}>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="למשל: מורה למתמטיקה, שיפוצניק..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className={styles.searchBtn} onClick={handleSearch}>
              חפש
            </button>
          </div>
        </div>

        {loading && <LoadingSpinner message="מחפש ספקים..." />}

        {!loading && error && (
          <ErrorMessage message={error} onRetry={handleRetry} />
        )}

        {!loading && !error && (
          <>
            <div className={styles.resultsLabel}>
              {matchedCategory
                ? `${items.length} נמצאו בקטגוריה ${matchedCategory}`
                : `${items.length} נמצאו קרוב אליך`}
            </div>

            {items.length === 0 ? (
              <div className={styles.empty}>לא נמצאו ספקים מתאימים</div>
            ) : (
              items.map((provider) => (
                <ProviderCard
                  key={provider._id}
                  provider={provider}
                  coords={coords}
                  isFavorite={favoriteIds.includes(provider._id)}
                  onToggleFavorite={user ? handleToggleFavorite : undefined}
                />
              ))
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Feed;