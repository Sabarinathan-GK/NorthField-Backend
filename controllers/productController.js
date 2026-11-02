const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

const listProducts = asyncHandler(async (request, response) => {
  const filter = request.query.category && request.query.category !== "All"
    ? { category: request.query.category }
    : {};
  const products = await Product.find(filter).sort({ createdAt: -1 });
  return response.json(products);
});

const getProduct = asyncHandler(async (request, response) => {
  const product = await Product.findById(request.params.id);
  if (!product) return response.status(404).json({ error: "That product could not be found." });
  return response.json(product);
});

const createProduct = asyncHandler(async (request, response) => {
  const { name, category, price, description, image, color, badge } = request.body || {};
  if (typeof name !== "string" || name.trim().length < 2
    || typeof category !== "string" || !category.trim()
    || typeof description !== "string" || !description.trim()
    || typeof image !== "string" || !/^https?:\/\//i.test(image)
    || !Number.isFinite(Number(price)) || Number(price) <= 0) {
    return response.status(400).json({ error: "Add a name, category, description, valid image URL, and price greater than zero." });
  }

  const product = await Product.create({
    name: name.trim(),
    category: category.trim(),
    price: Number(price),
    description: description.trim(),
    image: image.trim(),
    color: typeof color === "string" ? color.trim() : "",
    badge: typeof badge === "string" ? badge.trim() : "",
  });
  return response.status(201).json(product);
});

const deleteProduct = asyncHandler(async (request, response) => {
  const product = await Product.findByIdAndDelete(request.params.id);
  if (!product) return response.status(404).json({ error: "That product could not be found." });
  return response.status(204).end();
});

module.exports = { createProduct, deleteProduct, getProduct, listProducts };