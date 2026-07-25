import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

export const useFetch = <T,>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
  if (!url) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(url);
      setData(response.data.data as T);
    } catch (err: any) {
      setError(err.response?.data?.message || "משהו השתבש");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};