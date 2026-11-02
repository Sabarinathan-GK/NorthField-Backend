const express = require('express');
const { createProduct, deleteProduct, getProduct, listProducts } = require("../controllers/productController");
const { authenticate, requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/", listProducts);
router.get("/:id", getProduct);
router.post("/", authenticate, requireAdmin, createProduct);
router.delete("/:id", authenticate, requireAdmin, deleteProduct);

module.exports = router;
