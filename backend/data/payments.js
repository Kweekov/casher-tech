const orders = require("./orders");

const METHODS = ["bank_card", "sbp", "cash"];
const CARD_BRANDS = ["mir", "visa", "mastercard"];
const PROVIDERS = {
  bank_card: ["yookassa", "tbank", "cloudpayments"],
  sbp: ["sbp", "tbank_sbp", "yookassa_sbp"],
  cash: ["cash"],
};

function createRandom(seed) {
  let state = (seed >>> 0) + 0x9e3779b9;
  return function next() {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(arr, rnd) {
  return arr[Math.floor(rnd() * arr.length)];
}

function buildCardMask(rnd) {
  const tail = String(1000 + Math.floor(rnd() * 9000));
  return `**** **** **** ${tail}`;
}

function buildPayment(order, index) {
  const rnd = createRandom(index + 1000);
  const method = pick(METHODS, rnd);
  const provider = pick(PROVIDERS[method], rnd);

  let status = "success";
  if (order.paymentStatus === "pending" || order.status === "pending") status = "pending";
  if (order.paymentStatus === "failed" || order.status === "cancelled") status = "failed";

  const createdAt = new Date(new Date(order.createdAt).getTime() + (1 + Math.floor(rnd() * 120)) * 60 * 1000);
  const paidAt =
    status === "success"
      ? new Date(createdAt.getTime() + (1 + Math.floor(rnd() * 600)) * 1000).toISOString()
      : null;

  const cardBrand = method === "bank_card" ? pick(CARD_BRANDS, rnd) : null;
  const cardMask = method === "bank_card" ? buildCardMask(rnd) : null;

  return {
    id: `pay_${(index + 1).toString(36)}_${Math.floor(rnd() * 1e9).toString(36)}`,
    orderId: order.id,
    userId: order.userId,
    amount: order.total,
    currency: "RUB",
    method,
    cardBrand,
    cardMask,
    status,
    createdAt: createdAt.toISOString(),
    paidAt,
    provider,
  };
}

const payments = orders.map((order, index) => buildPayment(order, index));

module.exports = payments;