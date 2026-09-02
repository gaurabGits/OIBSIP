const express = require("express");
const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const {
    createInventory,
    getInventory,
} = require("../controllers/inventoryController");


const router = express.Router();


router.post("/", protect, admin, createInventory);
router.get("/", getInventory);


module.exports = router;