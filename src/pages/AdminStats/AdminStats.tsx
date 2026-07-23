import { useMemo } from "react";
import { useFetch } from "../../hooks/useFetch";
import AdminLayout from "../../components/layout/AdminLayout/AdminLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import type { Category } from "../../types";
import styles from "./AdminStats.module.css";

interface Stats {
  totalUsers: number;
  totalProviders: number;
  totalSeekers: number;
  totalReviews: number;
  newUsersThisMonth: number;
  newProvidersThisMonth: number;
  newReviewsThisMonth: number;
  averageRating: number;
}

interface CategoryWithCount extends Category {
  providerCount: number;
}

const barColors = ["var(--color-primary)", "var(--amber)", "var(--purple)"];

const AdminStats = () => {
  const { data: stats, loading, error, refetch } = useFetch<Stats>("/admin/stats");
  const { data: categories } = useFetch<CategoryWithCount[]>("/categories");

  const topCategories = useMemo(() => {
    const sorted = [...(categories || [])].sort((a, b) => b.providerCount - a.providerCount).slice(0, 5);
    const max = sorted[0]?.providerCount || 1;
    return sorted.map((category) => ({
      ...category,
      percent: Math.round((category.providerCount / max) * 100),
    }));
  }, [categories]);

  const seekerPercent = useMemo(() => {
    if (!stats || stats.totalUsers === 0) return 0;
    return Math.round((stats.totalSeekers / stats.totalUsers) * 100);
  }, [stats]);

  const providerPercent = useMemo(() => {
    if (!stats || stats.totalUsers === 0) return 0;
    return Math.round((stats.totalProviders / stats.totalUsers) * 100);
  }, [stats]);

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner message="טוען סטטיסטיקות..." />
      </AdminLayout>
    );
  }

  if (error || !stats) {
    return (
      <AdminLayout>
        <ErrorMessage message={error || "לא ניתן לטעון נתונים"} onRetry={refetch} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={styles.grid}>
        <div className={styles.item}>
          <div className={styles.number}>{stats.totalUsers}</div>
          <div className={styles.label}>משתמשים</div>
          <div className={styles.delta}>+{stats.newUsersThisMonth} החודש</div>
        </div>

        <div className={styles.item}>
          <div className={styles.number}>{stats.totalProviders}</div>
          <div className={styles.label}>נותני שירות</div>
          <div className={styles.delta}>+{stats.newProvidersThisMonth} החודש</div>
        </div>

        <div className={styles.item}>
          <div className={styles.number}>{stats.totalReviews}</div>
          <div className={styles.label}>ביקורות</div>
          <div className={styles.delta}>+{stats.newReviewsThisMonth} החודש</div>
        </div>
      </div>

      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>ספקים לפי קטגוריה</div>

          {topCategories.length === 0 ? (
            <div className={styles.empty}>אין נתונים עדיין</div>
          ) : (
            topCategories.map((category, index) => (
              <div key={category._id} className={styles.barRow}>
                <span className={styles.barLabel}>{category.name}</span>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: category.percent + "%", background: barColors[index % 3] }} />
                </div>
                <span className={styles.barValue}>{category.providerCount}</span>
              </div>
            ))
          )}
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>התפלגות משתמשים</div>

          <div className={styles.distRow}>
            <div className={styles.distHeader}>
              <span className={styles.distLabel}>מחפשי שירות</span>
              <span className={styles.distValue}>{stats.totalSeekers}</span>
            </div>
            <div className={styles.barTrack}>
              <div className={styles.barFill} style={{ width: seekerPercent + "%", background: "var(--purple)" }} />
            </div>
          </div>

          <div className={styles.distRow}>
            <div className={styles.distHeader}>
              <span className={styles.distLabel}>נותני שירות</span>
              <span className={styles.distValue}>{stats.totalProviders}</span>
            </div>
            <div className={styles.barTrack}>
              <div className={styles.barFill} style={{ width: providerPercent + "%", background: "var(--color-primary)" }} />
            </div>
          </div>

          <div className={styles.ratingRow}>
            <span className={styles.distLabel}>דירוג ממוצע</span>
            <span className={styles.ratingValue}>{stats.averageRating}</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminStats;