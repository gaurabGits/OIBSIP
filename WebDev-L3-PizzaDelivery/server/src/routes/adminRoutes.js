const express = require("express");

const { adminLogin, getUsers } = require("../controllers/adminController");
const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/login", adminLogin);
router.get("/users", protect, admin, getUsers);

module.exports = router;