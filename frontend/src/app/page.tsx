'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { OrdersList } from '@/components/orders/OrdersList';
import { Loader } from '@/components/common/Loader';
import { ErrorState } from '@/components/common/ErrorState';
import { ordersApi } from '@/services/api';
import { OrderWithDetails } from '@/types';
import { useOrders } from '@/hooks/useOrders';
import { formatPrice } from '@/utils/format';
import toast, { Toaster } from 'react-hot-toast';

function OrderModal({ orderId, onClose }: { orderId: string; onClose: () => void }) {
  const [orderDetails, setOrderDetails] = useState<OrderWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi.getById(orderId)
      .then(setOrderDetails)
      .catch(() => toast.error('Ошибка загрузки деталей'))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">Загрузка...</div>
      </div>
    );
  }

  if (!orderDetails) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">Заказ {orderDetails.order.id}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded">
            <h3 className="font-semibold mb-2">Покупатель</h3>
            <p>{orderDetails.user.firstName} {orderDetails.user.lastName}</p>
            <p className="text-sm text-gray-600">{orderDetails.user.email}</p>
            <p className="text-sm text-gray-600">{orderDetails.user.phone}</p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Товары</h3>
            <div className="space-y-2">
              {orderDetails.order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm border-b pb-2">
                  <div>
                    <span className="font-medium">{item.productName}</span>
                    <span className="text-gray-500 ml-2">Размер: {item.selectedSize}</span>
                    <span className="text-gray-500 ml-2">x{item.quantity}</span>
                  </div>
                  <span>{formatPrice(item.finalPricePerItem * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded">
            <h3 className="font-semibold mb-2">Доставка</h3>
            <p className="text-sm">
              {orderDetails.deliveryAddress.city}, {orderDetails.deliveryAddress.street}, 
              д. {orderDetails.deliveryAddress.house}, кв. {orderDetails.deliveryAddress.apartment}
            </p>
            <p className="text-sm text-gray-600">Статус: {orderDetails.order.deliveryStatus}</p>
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded">
            <h3 className="font-semibold mb-2">Оплата</h3>
            <p className="text-sm">Метод: {orderDetails.payment.method === 'bank_card' ? 'Банковская карта' : 'СБП'}</p>
            <p className="text-sm">Сумма: {formatPrice(orderDetails.payment.amount)}</p>
            <p className="text-sm text-green-600">Статус: Оплачено</p>
          </div>

          <div className="mt-4 pt-3 border-t text-right">
            <p className="text-lg font-bold">
              Итого: {formatPrice(orderDetails.order.total)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { orders, loading, error } = useOrders(200);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (loading) {
    return <Loader message="Загрузка заказов..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="mx-auto mt-4 flex w-full max-w-4xl justify-end px-4">
        <Link href="/tasks" className="rounded bg-black px-3 py-2 text-sm text-white hover:bg-gray-800">
          Задания для собеседования
        </Link>
      </div>
      <OrdersList orders={orders} onOrderClick={setSelectedOrderId} />
      {selectedOrderId && (
        <OrderModal orderId={selectedOrderId} onClose={() => setSelectedOrderId(null)} />
      )}
    </>
  );
}