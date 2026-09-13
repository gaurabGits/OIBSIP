const express = require("express");
const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const {
  getStoreSettings,
  updateStoreSettings,
} = require("../controllers/storeController");

const router = express.Router();

router.get("/", getStoreSettings);
router.patch("/", protect, admin, updateStoreSettings);

module.exports = router;