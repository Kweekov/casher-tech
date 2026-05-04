import { Order } from "@/types";

export function getOrderItemsCount(order: Order): number {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getStatusLabel(status: Order["status"]): string {
  const map: Record<Order["status"], string> = {
    pending: "Ожидает",
    paid: "Оплачен",
    delivered: "Доставлен",
    cancelled: "Отменен",
  };

  return map[status];
}
