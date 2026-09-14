const express = require("express");
const protect = require("../middleware/authMiddleware");
const user = require("../middleware/userMiddleware");

const {
  getCart,
  replaceCart,
  clearCart,
} = require("../controllers/cartController");

const router = express.Router();

router.use(protect, user);

router.get("/", getCart);
router.put("/", replaceCart);
router.delete("/", clearCart);

module.exports = router;