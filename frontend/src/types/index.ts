export interface Address {
    id: string;
    alias: string;
    postalCode: string;
    city: string;
    street: string;
    house: string;
    apartment: string;
    floor: string;
    intercom: string | null;
  }
  
  export interface User {
    id: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    patronymic: string;
    registeredAt: string;
    isSubscribed: boolean;
    deliveryAddresses: Address[];
  }
  
  export interface OrderItem {
    productId: string;
    productName: string;
    slug: string;
    selectedSize: string;
    sizeId: number;
    quantity: number;
    basePrice: number;
    discountPerItem: number;
    finalPricePerItem: number;
    totalPrice: number;
  }
  
  export interface Order {
    id: string;
    createdAt: string;
    updatedAt: string;
    status: 'pending' | 'paid' | 'delivered' | 'cancelled';
    paymentStatus: 'pending' | 'succeeded' | 'failed';
    deliveryStatus: 'processing' | 'completed' | 'cancelled';
    userId: string;
    deliveryAddressId: string;
    comment: string;
    items: OrderItem[];
    subtotal: number;
    deliveryCost: number;
    total: number;
    promocode: string | null;
  }
  
  export interface Payment {
    id: string;
    orderId: string;
    userId: string;
    amount: number;
    currency: string;
    method: 'bank_card' | 'sbp' | 'cash';
    cardBrand: string | null;
    cardMask: string | null;
    status: 'success' | 'failed' | 'pending';
    createdAt: string;
    paidAt: string | null;
    provider: string;
  }
  
  export interface OrderWithDetails {
    order: Order;
    user: User;
    payment: Payment;
    deliveryAddress: Address;
  }
  
  export interface ApiResponse<T> {
    data: T;
    pagination?: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  }