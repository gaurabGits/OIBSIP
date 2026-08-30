const express = require("express");
const { 
    getPizzas, 
    createPizza, 
    getPizzaById,
    updatePizza, 
    deletePizza
} = require ("../controllers/pizzaController");

const admin = require("../middleware/adminMiddleware");
const protect = require("../middleware/authMiddleware")

const router = express.Router();


router.get("/", getPizzas);
router.get("/:id", getPizzaById);

router.post("/", protect, admin, createPizza);
router.put("/:id", protect, admin, updatePizza);
router.delete("/:id", protect, admin, deletePizza);


module.exports = router;