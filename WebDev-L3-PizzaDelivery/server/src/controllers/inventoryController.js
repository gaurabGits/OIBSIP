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

const getAllInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find().sort({
      category: 1,
      name: 1,
    });

    res.status(200).json({
      inventory,
    });
  } catch (error) {
    console.error("Get all inventory error:", error);

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

const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, category, price, stock, lowStockThreshold } = req.body;

    const inventory = await Inventory.findById(id);

    if (!inventory) {
      return res.status(404).json({
        message: "Inventory item not found",
      });
    }

    if (name !== undefined) inventory.name = name;
    if (category !== undefined) inventory.category = category;
    if (price !== undefined) inventory.price = price;
    if (stock !== undefined) inventory.stock = stock;
    if (lowStockThreshold !== undefined) {
      inventory.lowStockThreshold = lowStockThreshold;
    }

    await inventory.save();

    res.status(200).json({
      message: "Inventory updated successfully",
      inventory,
    });
  } catch (error) {
    console.error("Update inventory error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


const deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;

    const inventory = await Inventory.findById(id);

    if (!inventory) {
      return res.status(404).json({
        message: "Inventory item not found",
      });
    }

    await Inventory.findByIdAndDelete(id);

    res.status(200).json({
      message: "Inventory item deleted successfully",
    });
  } catch (error) {
    console.error("Delete inventory error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


module.exports = {
    createInventory,
    getAllInventory,
    getInventory,
    updateInventory,
    deleteInventory,
}