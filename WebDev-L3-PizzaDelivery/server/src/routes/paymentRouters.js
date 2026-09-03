const express = require("express");

const {
    createEsewaPyment,
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/esewa/create", createEsewaPyment);

module.exports = router;