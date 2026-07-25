import { useState, useMemo, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faCheck } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useFetch } from "../../hooks/useFetch";
import { toWhatsappNumber } from "../../utils/phone";
import { timeAgo } from "../../utils/timeAgo";
import Navbar from "../../components/layout/Navbar/Navbar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import type { Provider, ServiceRequest } from "../../types";
import styles from "./DashboardProvider.module.css";

type Filter = "pending" | "handled";

const DashboardProvider = () => {
  const { user } = useAuth();
  const { data: provider, loading: loadingProfile, error: profileError } =
    useFetch<Provider>("/providers/profile");

  const providerId = provider?._id;
  const {
    data: requests,
    loading: loadingRequests,
    error: requestsError,
    refetch,
  } = useFetch<ServiceRequest[]>(providerId ? "/requests/provider/" + providerId : "");

  const [filter, setFilter] = useState<Filter>("pending");
  const [updatingId, setUpdatingId] = useState("");

  const visibleRequests = useMemo(
    () => (requests || []).filter((request) => request.status === filter),
    [requests, filter]
  );

  const pendingCount = useMemo(
    () => (requests || []).filter((request) => request.status === "pending").length,
    [requests]
  );

  const handleMarkHandled = useCallback(
    async (requestId: string) => {
      setUpdatingId(requestId);
      try {
        await api.put("/requests/" + requestId, { status: "handled" });
        await refetch();
      } finally {
        setUpdatingId("");
      }
    },
    [refetch]
  );

  if (loadingProfile) return <LoadingSpinner message="טוען את הלוח שלך..." />;

  if (profileError) return <Navigate to="/provider/onboarding" replace />;

  return (
    <>
      <Navbar />

      <div className={styles.page}>
        <div className={styles.greeting}>שלום {user?.name}</div>
        <div className={styles.greetingSub}>
          {pendingCount === 0 ? "אין בקשות חדשות" : pendingCount + " בקשות חדשות"}
        </div>

        <div className={styles.sortRow}>
          <button
            className={filter === "pending" ? styles.sortBtnActive : styles.sortBtn}
            onClick={() => setFilter("pending")}
          >
            חדשות
          </button>
          <button
            className={filter === "handled" ? styles.sortBtnActive : styles.sortBtn}
            onClick={() => setFilter("handled")}
          >
            טופלו
          </button>
        </div>

        {loadingRequests && <LoadingSpinner message="טוען בקשות..." />}

        {!loadingRequests && requestsError && (
          <ErrorMessage message={requestsError} onRetry={refetch} />
        )}

        {!loadingRequests && !requestsError && visibleRequests.length === 0 && (
          <div className={styles.empty}>
            {filter === "pending" ? "אין בקשות חדשות" : "אין בקשות שטופלו"}
          </div>
        )}

        {!loadingRequests &&
          !requestsError &&
          visibleRequests.map((request) => {
            const phone = request.user?.phone;
            return (
              <div key={request._id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>{request.user?.name}</div>
                  <span className={styles.cardMeta}>{timeAgo(request.createdAt)}</span>
                </div>

                <div className={styles.cardDesc}>{request.text}</div>

                <div className={styles.cardFooter}>
                  {request.status === "pending" ? (
                    <button
                      className={styles.handledBtn}
                      onClick={() => handleMarkHandled(request._id)}
                      disabled={updatingId === request._id}
                    >
                      <FontAwesomeIcon icon={faCheck} /> סמן כטופל
                    </button>
                  ) : (
                    <span className={styles.handledTag}>טופל</span>
                  )}

                  {phone && (
                    <div className={styles.cardActions}>
                      <a href={"https://wa.me/" + toWhatsappNumber(phone)} target="_blank" rel="noreferrer" className={styles.cardWa}><FontAwesomeIcon icon={faWhatsapp} /> וואטסאפ</a>
                      <a href={"tel:" + phone} className={styles.cardTel}><FontAwesomeIcon icon={faPhone} /> חייג</a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default DashboardProvider;