const express = require('express');
const { createOrder, listOrders } = require("../controllers/orderController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.use(authenticate);
router.get("/", listOrders);
router.post("/", createOrder);

module.exports = router;
