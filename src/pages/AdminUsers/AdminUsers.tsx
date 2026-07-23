import { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useFetch } from "../../hooks/useFetch";
import AdminLayout from "../../components/layout/AdminLayout/AdminLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import type { User } from "../../types";
import styles from "./AdminUsers.module.css";

interface AdminUser extends User {
  createdAt: string;
}

const palettes = [
  { background: "var(--color-primary-light)", color: "var(--color-primary-medium)" },
  { background: "var(--amber-lt)", color: "var(--amber-dk)" },
  { background: "var(--purple-lt)", color: "var(--purple)" },
];

const roleLabels: Record<string, string> = {
  provider: "נותן שירות",
  user: "מחפש שירות",
  admin: "מנהל",
};

const getInitials = (name: string) =>
  name.trim().split(" ").slice(0, 2).map((part) => part[0]).join("");

const formatDate = (iso: string) => new Date(iso).toLocaleDateString("he-IL");

const AdminUsers = () => {
  const { data: users, loading, error, refetch } = useFetch<AdminUser[]>("/admin/users");
  const [search, setSearch] = useState("");

  const visibleUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users || [];
    return (users || []).filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.email.toLowerCase().includes(term)
    );
  }, [users, search]);

  const roleClass = (role: string) => {
    if (role === "provider") return styles.badgeProvider;
    if (role === "admin") return styles.badgeAdmin;
    return styles.badgeSeeker;
  };

  return (
    <AdminLayout>
      <div className={styles.header}>
        <h2 className={styles.title}>משתמשים</h2>
        <span className={styles.count}>{visibleUsers.length} רשומים</span>
      </div>

      <div className={styles.searchBar}>
        <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} />
        <input className={styles.searchInput} type="text" placeholder="חפש לפי שם או אימייל" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading && <LoadingSpinner message="טוען משתמשים..." />}

      {!loading && error && <ErrorMessage message={error} onRetry={refetch} />}

      {!loading && !error && (
        <div className={styles.list}>
          {visibleUsers.length === 0 ? (
            <div className={styles.empty}>לא נמצאו משתמשים</div>
          ) : (
            visibleUsers.map((item, index) => (
              <div key={item._id} className={styles.row}>
                <div className={styles.avatar} style={palettes[index % 3]}>
                  {getInitials(item.name)}
                </div>

                <div className={styles.body}>
                  <div className={styles.name}>{item.name}</div>
                  <div className={styles.email}>{item.email}</div>
                </div>

                <span className={roleClass(item.role)}>{roleLabels[item.role]}</span>
                <span className={styles.joinDate}>{formatDate(item.createdAt)}</span>
              </div>
            ))
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;