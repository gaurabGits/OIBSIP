const express = require("express");
const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const {
    createInventory,
    getInventory,
    getAllInventory,
    updateInventory,
    deleteInventory,
} = require("../controllers/inventoryController");


const router = express.Router();


router.post("/", protect, admin, createInventory);

router.get("/", getInventory);

router.get("/admin", protect, admin, getAllInventory);

router.patch("/:id", protect, admin, updateInventory);

router.delete("/:id", protect, admin, deleteInventory);


module.exports = router;