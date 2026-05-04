import { useEffect, useState } from "react";
import { ordersApi } from "@/services/api";
import { Order } from "@/types";

export function useOrders(limit = 100) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    ordersApi
      .getAll({ limit, offset: 0 })
      .then((response) => {
        setOrders(response.data);
      })
      .catch(() => {
        setError("Не удалось загрузить заказы");
      })
      .finally(() => setLoading(false));
  }, [limit]);

  return {
    orders,
    setOrders,
    loading,
    error,
  };
}
