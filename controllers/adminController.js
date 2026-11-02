const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const analytics = asyncHandler(async (_request, response) => {
  const [orders, productCount, customerCount, topProducts] = await Promise.all([
    Order.find().select("total items"),
    Product.countDocuments(),
    User.countDocuments({ role: "customer" }),
    Order.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.productId", product: { $first: "$items.name" }, quantity: { $sum: "$items.quantity" } } },
      { $sort: { quantity: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, product: 1, quantity: 1 } },
    ]),
  ]);
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const unitsSold = orders.reduce(
    (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0,
  );
  return response.json({
    revenue: Number(revenue.toFixed(2)),
    orderCount: orders.length,
    productCount,
    customerCount,
    unitsSold,
    topProducts,
  });
});

module.exports = {
  analytics
};