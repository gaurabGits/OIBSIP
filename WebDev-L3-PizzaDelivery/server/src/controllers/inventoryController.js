const Inventory = require("../models/inventory");

const createInventory = async (req, res) => {
    try {
        const { name, category, price, stock, lowStockThreshold } = req.body;

        if (!name || !category || price === undefined || stock === undefined) {
            return res.status(400).json({
                message: "Name, category, price and stock are required",
            });
        }

        const inventory = await Inventory.create({
            name,
            category,
            price,
            stock,
            lowStockThreshold,
        });

        res.status(201).json({
            message: "Inventory item created successfully",
            inventory,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

const getInventory = async (req, res) => {
    try {
        const inventory = await Inventory.find({
            stock: { $gt: 0 },
        });

        res.status(200).json({
            bases: inventory.filter(item => item.category === "base"),
            sauces: inventory.filter(item => item.category === "sauce"),
            cheeses: inventory.filter(item => item.category === "cheese"),
            vegetables: inventory.filter(item => item.category === "vegetable"),
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


module.exports = {
    createInventory,
    getInventory,
}