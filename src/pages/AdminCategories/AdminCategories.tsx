import { useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import api from "../../services/api";
import { useFetch } from "../../hooks/useFetch";
import { getCategoryIcon, iconOptions } from "../../utils/categoryIcon";
import AdminLayout from "../../components/layout/AdminLayout/AdminLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import type { Category } from "../../types";
import styles from "./AdminCategories.module.css";

interface CategoryWithCount extends Category {
  providerCount: number;
}

const AdminCategories = () => {
  const { data: categories, loading, error, refetch } = useFetch<CategoryWithCount[]>("/categories");

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(iconOptions[0]);
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleAdd = useCallback(async () => {
    setFormError("");
    if (name.trim().length < 2) {
      setFormError("שם הקטגוריה חייב להכיל לפחות 2 תווים");
      return;
    }

    setBusy(true);
    try {
      await api.post("/categories/add", { name: name.trim(), icon });
      setName("");
      setShowForm(false);
      await refetch();
    } catch (err: any) {
      setFormError(err.response?.data?.message || "ההוספה נכשלה");
    } finally {
      setBusy(false);
    }
  }, [name, icon, refetch]);

  const handleDelete = useCallback(
    async (category: CategoryWithCount) => {
      const warning =
        category.providerCount > 0
          ? "לקטגוריה הזו יש " + category.providerCount + " ספקים. למחוק בכל זאת?"
          : "למחוק את הקטגוריה?";

      if (!window.confirm(warning)) return;

      try {
        await api.delete("/categories/" + category._id);
        await refetch();
      } catch (err: any) {
        setFormError(err.response?.data?.message || "המחיקה נכשלה");
      }
    },
    [refetch]
  );

  return (
    <AdminLayout>
      <div className={styles.header}>
        <h2 className={styles.title}>קטגוריות פעילות</h2>
        <button className={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? "ביטול" : "+ הוסף קטגוריה"}
        </button>
      </div>

      {showForm && (
        <div className={styles.form}>
          <input className={styles.input} type="text" placeholder="שם הקטגוריה" value={name} onChange={(e) => setName(e.target.value)} />
          <select className={styles.select} value={icon} onChange={(e) => setIcon(e.target.value)}>
            {iconOptions.map((option) => (
              <option key={option} value={option}>{option.replace("fa-", "")}</option>
            ))}
          </select>
          <div className={styles.preview}><FontAwesomeIcon icon={getCategoryIcon(icon)} /></div>
          <button className={styles.saveBtn} onClick={handleAdd} disabled={busy}>
            {busy ? "שומר..." : "שמור"}
          </button>
        </div>
      )}

      {formError && <div className={styles.errorText}>{formError}</div>}

      {loading && <LoadingSpinner message="טוען קטגוריות..." />}

      {!loading && error && <ErrorMessage message={error} onRetry={refetch} />}

      {!loading && !error && (
        <div className={styles.list}>
          {(categories || []).length === 0 ? (
            <div className={styles.empty}>אין קטגוריות עדיין</div>
          ) : (
            (categories || []).map((category) => (
              <div key={category._id} className={styles.row}>
                <div className={styles.icon}><FontAwesomeIcon icon={getCategoryIcon(category.icon)} /></div>
                <span className={styles.name}>{category.name}</span>
                <span className={styles.count}>{category.providerCount} נותנים</span>
                <button className={styles.deleteBtn} onClick={() => handleDelete(category)} title="מחק">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCategories;