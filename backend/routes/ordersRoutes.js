const express = require("express");
const { validatePagination } = require("../middleware/validatePagination");
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
} = require("../controllers/ordersController");

const router = express.Router();

router.get("/", validatePagination, getOrders);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.patch("/:id/status", updateOrderStatus);

module.exports = router;
