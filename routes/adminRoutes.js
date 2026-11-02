const express = require('express');

const { analytics } = require('../controllers/adminController')

const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get("/analytics", authenticate, requireAdmin, analytics);

module.exports = router;
