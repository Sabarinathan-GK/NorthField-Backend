const Order = require("../models/Order");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

const listOrders = asyncHandler(async (request, response) => {
  const filter = request.user.role === "admin" ? {} : { userId: request.user.id };
  const orders = await Order.find(filter).sort({ createdAt: -1 });
  return response.json(orders);
});

const createOrder = asyncHandler(async (request, response) => {
  const { items, paymentMethod } = request.body || {};
  if (!Array.isArray(items) || items.length === 0 || !["card", "delivery"].includes(paymentMethod)) {
    return response.status(400).json({ error: "Add items to your cart and choose a payment method." });
  }
  if (items.length > 100) {
    return response.status(400).json({ error: "Your cart has too many different items." });
  }

  const quantities = new Map();
  for (const item of items) {
    const productId = typeof item?.productId === "string" ? item.productId : "";
    const quantity = Number(item?.quantity);
    if (!/^(?:p-\d{3}|[a-f\d]{24})$/i.test(productId) || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      return response.status(400).json({ error: "One or more cart items are invalid. Please review your cart." });
    }
    quantities.set(productId, (quantities.get(productId) || 0) + quantity);
    if (quantities.get(productId) > 20) {
      return response.status(400).json({ error: "A cart item exceeds the maximum quantity of 20." });
    }
  }

  const products = await Product.find({ _id: { $in: [...quantities.keys()] } });
  if (products.length !== quantities.size) {
    return response.status(400).json({ error: "One or more cart items are unavailable. Please review your cart." });
  }

  const orderItems = products.map((product) => ({
    productId: product._id,
    name: product.name,
    image: product.image,
    price: product.price,
    quantity: quantities.get(product.id),
  }));
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = Number((subtotal + (subtotal >= 100 ? 0 : 8)).toFixed(2));
  const order = await Order.create({
    userId: request.user.id,
    customerName: request.user.name,
    customerEmail: request.user.email,
    items: orderItems,
    total,
    paymentMethod,
  });
  return response.status(201).json(order);
});


module.exports = {
  listOrders,
  createOrder
}