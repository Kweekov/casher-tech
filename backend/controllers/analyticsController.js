const { users, orders } = require("../utils/dataStore");

function getAnalytics(_req, res) {
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const avgOrder = orders.length ? totalRevenue / orders.length : 0;

  const statusCount = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const productCount = {};
  orders.forEach((order) => {
    order.items.forEach((item) => {
      productCount[item.productId] = (productCount[item.productId] || 0) + item.quantity;
    });
  });

  let topProduct = null;
  let maxCount = 0;
  Object.entries(productCount).forEach(([productId, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topProduct = { productId, count };
    }
  });

  res.json({
    totalRevenue,
    avgOrder,
    statusCount,
    topProduct,
    totalOrders: orders.length,
  });
}

function getTopClients(_req, res) {
  const userSpending = {};

  orders.forEach((order) => {
    if (!userSpending[order.userId]) {
      userSpending[order.userId] = {
        totalSpent: 0,
        orderCount: 0,
        lastOrderDate: order.createdAt,
      };
    }

    userSpending[order.userId].totalSpent += order.total;
    userSpending[order.userId].orderCount += 1;
    if (new Date(order.createdAt) > new Date(userSpending[order.userId].lastOrderDate)) {
      userSpending[order.userId].lastOrderDate = order.createdAt;
    }
  });

  const topSpenders = Object.entries(userSpending)
    .map(([userId, stats]) => {
      const user = users.find((item) => item.id === userId);
      return {
        userId,
        fullName: user ? `${user.firstName} ${user.lastName}` : "Unknown User",
        email: user?.email || null,
        ...stats,
      };
    })
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 10);

  const totalCustomers = users.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const averageCheck = totalCustomers ? totalRevenue / totalCustomers : 0;
  const loyalCustomerRate = totalCustomers
    ? (topSpenders.filter((client) => client.totalSpent > 3000000).length / totalCustomers) * 100
    : 0;

  res.json({
    topSpenders,
    summary: {
      totalCustomers,
      averageCheck,
      loyalCustomerRate,
    },
  });
}

module.exports = {
  getAnalytics,
  getTopClients,
};
