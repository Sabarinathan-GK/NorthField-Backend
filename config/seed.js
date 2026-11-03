const bcrypt = require("bcryptjs");
const Product = require("../models/Product");
const User = require("../models/User");

require('dotenv').config();

const products = [
  { _id: "p-001", name: "Everyday Ceramic Mug", category: "Home", price: 28, description: "A quietly beautiful mug, shaped by hand and finished in a soft, satin glaze. Made for slow mornings and second cups.", image: "https://images.unsplash.com/photo-1514228742587-6b1558f8cca3d?auto=format&fit=crop&w=1000&q=85", color: "Warm white", badge: "Bestseller" },
  { _id: "p-002", name: "Linen Market Tote", category: "Accessories", price: 42, description: "Roomy, reliable, and woven from durable European linen. An everyday carryall that only gets better with use.", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85", color: "Natural flax", badge: "Made to last" },
  { _id: "p-003", name: "Ribbed Glass Carafe", category: "Home", price: 56, description: "A sculptural glass carafe with a satisfying weight and fine vertical ridges. Equally at home on your table or bedside.", image: "https://images.unsplash.com/photo-1786467544794-97f763f5e71b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D", color: "Clear glass", badge: "" },
  { _id: "p-004", name: "Everywhere Throw", category: "Textiles", price: 118, description: "Soft cotton in a timeless woven check. Keep one over the sofa, at the end of the bed, or ready for a cool evening outside.", image: "https://plus.unsplash.com/premium_photo-1668046490161-f08d1280f10c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D", color: "Olive check", badge: "Small batch" },
  { _id: "p-005", name: "Sunday Serving Bowl", category: "Home", price: 64, description: "An easy-to-reach stoneware bowl for shared salads, fruit, and everything in between. Each one has its own glaze variation.", image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1000&q=85", color: "Oat glaze", badge: "" },
  { _id: "p-006", name: "Field Notes Journal", category: "Stationery", price: 24, description: "A clothbound notebook with smooth, recycled pages and just enough structure to make room for your own ideas.", image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=1000&q=85", color: "Forest green", badge: "Customer favorite" },
  { _id: "p-007", name: "Soft Form Candle", category: "Home", price: 38, description: "A gently scented, clean-burning candle poured into a reusable ceramic vessel. Notes of cedar, citrus, and something warm.", image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85", color: "Cedar & citrus", badge: "" },
  { _id: "p-008", name: "Woven Table Runner", category: "Textiles", price: 72, description: "A relaxed linen runner that brings a little texture to everyday dinners. Woven in small batches from responsibly sourced flax.", image: "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=1000&q=85", color: "Undyed linen", badge: "" },
];

const seedDatabase = async () => {
  const productCount = await Product.countDocuments();
  if (productCount === 0) await Product.insertMany(products);

  const email = (process.env.ADMIN_EMAIL || "admin@northfield.com").trim().toLowerCase();
  const existingAdmin = await User.findOne({ email }).select("+passwordHash");
  console.log(`${email} + ${existingAdmin}`);
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin123!", 12);
    await User.create({ name: "Northfield Admin", email, passwordHash, role: "admin" });
  }
}

module.exports = {
  seedDatabase
}
