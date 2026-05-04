const { users, orders, payments } = require("../utils/dataStore");

function getOrders(req, res) {
  const { userId, status } = req.query;
  const { limit, offset } = req.pagination;

  let result = [...orders];
  if (userId) {
    result = result.filter((order) => order.userId === userId);
  }
  if (status) {
    result = result.filter((order) => order.status === status);
  }

  const total = result.length;
  const data = result.slice(offset, offset + limit);

  res.json({
    data,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    },
  });
}

function getOrderById(req, res) {
  const { id } = req.params;
  const order = orders.find((item) => item.id === id);

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  const user = users.find((item) => item.id === order.userId);
  const payment = payments.find((item) => item.orderId === order.id);
  const deliveryAddress = user?.deliveryAddresses?.find((addr) => addr.id === order.deliveryAddressId);

  return res.json({
    order,
    user,
    payment,
    deliveryAddress,
  });
}

function createOrder(req, res) {
  const { userId, items, deliveryAddressId, comment } = req.body;

  if (!userId || !items || !items.length) {
    return res.status(400).json({ error: "userId and items are required" });
  }

  const user = users.find((item) => item.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const subtotal = items.reduce((sum, item) => sum + item.finalPricePerItem * item.quantity, 0);
  const deliveryCost = subtotal > 1000000 ? 0 : 50000;
  const total = subtotal + deliveryCost;

  const newOrder = {
    id: `ORD-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "pending",
    paymentStatus: "pending",
    deliveryStatus: "processing",
    userId,
    deliveryAddressId,
    comment: comment || "",
    items,
    subtotal,
    deliveryCost,
    total,
    promocode: null,
  };

  orders.push(newOrder);
  return res.status(201).json(newOrder);
}

function updateOrderStatus(req, res) {
  const { id } = req.params;
  const { status, deliveryStatus } = req.body;

  const order = orders.find((item) => item.id === id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  if (status) order.status = status;
  if (deliveryStatus) order.deliveryStatus = deliveryStatus;
  order.updatedAt = new Date().toISOString();

  return res.json(order);
}

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
};
