'use client';

import React, { useEffect, useState } from 'react';
import { Order } from '@/types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ordersApi } from '@/services/api';

interface OrdersListProps {
  orders: Order[];
  onOrderClick?: (orderId: string) => void;
}

const calculateTotal = (order: Order): number => {
  return order.items.reduce((sum, item) => {
    return sum + (item.basePrice * item.quantity);
  }, 0);
};

const getStatusText = (status: Order['status']): string => {
  return status;
};

const getStatusColor = (status: Order['status']): string => {
  if (status === 'paid') return 'bg-gray-200 text-gray-700';
  if (status === 'delivered') return 'bg-gray-200 text-gray-700';
  if (status === 'pending') return 'bg-gray-200 text-gray-700';
  return 'bg-gray-200 text-gray-700';
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'yyyy-MM-dd HH:mm', { locale: ru });
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price / 100);
};

export const OrdersList: React.FC<OrdersListProps> = ({ orders, onOrderClick }) => {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [serverOrders, setServerOrders] = useState<Order[]>(orders);

  useEffect(() => {
    ordersApi
      .getAll({
        limit: 200,
        offset: 0,
        status: filter !== 'all' ? filter : undefined,
      })
      .then((response) => {
        setServerOrders(response.data);
      })
      .catch(() => {
        setServerOrders([]);
      });
  }, [search, filter]);
  
  let filteredOrders = [...serverOrders];
  if (search.trim()) {
    filteredOrders = filteredOrders.filter((order) => {
      return (
        order.id.includes(search) ||
        order.items.some((item) => item.productName.includes(search))
      );
    });
  }
  filteredOrders.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  
  const groupedOrders: { [key: string]: Order[] } = {
    Все: filteredOrders,
  };
  
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">История заказов</h1>
      
      <div className="mb-4 space-y-3">
        <input
          type="text"
          placeholder="Поиск по номеру заказа или товару..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <div className="flex gap-2">
          {['all', 'pending', 'paid', 'delivered', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-lg transition ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status === 'all' ? 'Все' : getStatusText(status as Order['status'])}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-6">
        {Object.entries(groupedOrders).map(([groupName, groupOrders]) => 
          groupOrders.length > 0 && (
            <div key={groupName}>
              <h2 className="text-lg font-semibold mb-3 text-gray-600">{groupName}</h2>
              <div className="space-y-3">
                {groupOrders.map(order => (
                  <div
                    key={order.id}
                    onClick={() => onOrderClick?.(order.id)}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-mono font-semibold">{order.id}</h3>
                        <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-sm text-gray-600">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} товаров
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        {formatPrice(calculateTotal(order))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
        
        {filteredOrders.length === 0 && <div className="text-center py-8 text-gray-400">Нет данных</div>}
      </div>
    </div>
  );
};