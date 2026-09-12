const express = require("express");

const {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    markCashPaymentPaid,
} = require("../controllers/orderController");
const protect  = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const user = require("../middleware/userMiddleware");


const router = express.Router();

router.post("/", protect, user, createOrder);

router.get("/my-orders", protect, user, getMyOrders);
router.get("/all-orders", protect, admin, getAllOrders);

router.patch("/:id/status", protect, admin, updateOrderStatus);
router.patch("/:id/cash-payment", protect, admin, markCashPaymentPaid);
module.exports = router;