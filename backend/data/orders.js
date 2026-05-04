const users = require("./users");

const productCatalog = [
  {
    productId: "299",
    productName: "Полузамок Pink mood",
    slug: "poluzamok-pink-mood",
    sizeId: 1448,
    sizes: ["XS", "S", "M", "L"],
    basePrice: 550000,
    discountPerItem: 50000,
  },
  {
    productId: "298",
    productName: "Майка Black night",
    slug: "mayka-black-night",
    sizeId: 1445,
    sizes: ["XS", "S", "M", "L"],
    basePrice: 250000,
    discountPerItem: 50000,
  },
  {
    productId: "294",
    productName: "Полузамок Batter mood",
    slug: "poluzamok-batter-mood",
    sizeId: 1453,
    sizes: ["XS", "S", "M", "L"],
    basePrice: 550000,
    discountPerItem: 50000,
  },
  {
    productId: "297",
    productName: "Брюки клеш Cherry night",
    slug: "bryuki-klesh-cherry-night",
    sizeId: 1439,
    sizes: ["XS", "S", "M", "L"],
    basePrice: 550000,
    discountPerItem: 50000,
  },
  {
    productId: "300",
    productName: "Брюки клеш Black night",
    slug: "bryuki-klesh-black-night",
    sizeId: 1456,
    sizes: ["XS", "S", "M", "L"],
    basePrice: 550000,
    discountPerItem: 50000,
  },
];

const statuses = ["pending", "paid", "delivered", "cancelled"];
const deliveryStatuses = ["processing", "completed", "cancelled"];
const comments = [
  "",
  "Пожалуйста, позвоните за 30 минут до доставки",
  "Доставка до 18:00",
  "Оставить у консьержа",
  "Не звонить в домофон, ребенок спит",
  "Доставить после 20:00",
  "Можно без звонка, оставить у двери",
  "Курьеру позвонить за 10 минут",
  "Проверить размер перед оплатой",
  "Подарочная упаковка",
];

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

function buildItem(product, rnd) {
  const quantity = 1 + Math.floor(rnd() * 4);
  const dynamicDiscount = product.discountPerItem + Math.floor(rnd() * 30000);
  const finalPricePerItem = Math.max(product.basePrice - dynamicDiscount, Math.floor(product.basePrice * 0.55));
  const sizeShift = Math.floor(rnd() * 5);

  return {
    productId: product.productId,
    productName: product.productName,
    slug: product.slug,
    selectedSize: product.sizes[sizeShift % product.sizes.length],
    sizeId: product.sizeId + sizeShift,
    quantity,
    basePrice: product.basePrice,
    discountPerItem: product.basePrice - finalPricePerItem,
    finalPricePerItem,
    totalPrice: finalPricePerItem * quantity,
  };
}

function createOrder(index) {
  const rnd = createRandom(index + 1);
  const user = users[Math.floor(rnd() * users.length)];
  const deliveryAddress = user.deliveryAddresses[Math.floor(rnd() * user.deliveryAddresses.length)];
  const itemCount = 1 + Math.floor(rnd() * 4);
  const items = [];
  const used = new Set();

  for (let i = 0; i < itemCount; i += 1) {
    let productIndex = Math.floor(rnd() * productCatalog.length);
    while (used.has(productIndex)) {
      productIndex = (productIndex + 1 + Math.floor(rnd() * 2)) % productCatalog.length;
    }
    used.add(productIndex);
    items.push(buildItem(productCatalog[productIndex], rnd));
  }

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryCost = subtotal >= 1200000 ? 0 : [0, 30000, 50000, 70000][Math.floor(rnd() * 4)];
  const total = subtotal + deliveryCost;

  const dayShift = Math.floor(rnd() * 240);
  const hourShift = Math.floor(rnd() * 24);
  const minuteShift = Math.floor(rnd() * 60);
  const secondShift = Math.floor(rnd() * 60);

  const createdAt = new Date(Date.UTC(2025, 8, 30 - dayShift, hourShift, minuteShift, secondShift));
  const updatedAt = new Date(createdAt.getTime() + (2 + Math.floor(rnd() * 96)) * 60 * 60 * 1000);

  const statusRoll = rnd();
  const status =
    statusRoll < 0.28 ? "pending" : statusRoll < 0.62 ? "paid" : statusRoll < 0.92 ? "delivered" : "cancelled";
  const deliveryStatus =
    status === "cancelled"
      ? "cancelled"
      : status === "delivered"
      ? "completed"
      : pick(deliveryStatuses.slice(0, 2), rnd);
  const paymentStatus =
    status === "pending" ? "pending" : status === "cancelled" ? "failed" : "succeeded";

  return {
    id: `ORD-2025-${String(index + 1).padStart(3, "0")}`,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    status,
    paymentStatus,
    deliveryStatus,
    userId: user.id,
    deliveryAddressId: deliveryAddress.id,
    comment: pick(comments, rnd),
    items,
    subtotal,
    deliveryCost,
    total,
    promocode: rnd() < 0.18 ? pick(["WELCOME20", "SALE10", "SPRING15", "BIRTHDAY"], rnd) : null,
  };
}

const orders = Array.from({ length: 500 }, (_, i) => createOrder(i));

module.exports = orders;