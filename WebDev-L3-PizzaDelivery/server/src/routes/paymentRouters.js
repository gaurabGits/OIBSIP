const express = require("express");
const {
    createEsewaPayment,
    esewaSuccess,
    esewaFailure,
    
} = require("../controllers/paymentController");
const protect = require("../middleware/authMiddleware");
const user = require("../middleware/userMiddleware");


const router = express.Router();

router.post("/esewa/create", protect, user, createEsewaPayment);

router.get("/esewa/success", esewaSuccess);
router.get("/esewa/failure", esewaFailure);

module.exports = router;
