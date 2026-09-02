const dotenv = require("dotenv");
const mongoose = require("mongoose");

const Inventory = require("../models/inventory");

dotenv.config();

const inventoryData = [
{
        name: "Classic Crust",
        category: "base",
        price: 150,
        stock: 50,
        lowStockThreshold: 20,
    },
    {
        name: "Thin Crust",
        category: "base",
        price: 130,
        stock: 50,
        lowStockThreshold: 20,
    },
    {
        name: "Pan Crust",
        category: "base",
        price: 160,
        stock: 50,
        lowStockThreshold: 20,
    },
    {
        name: "Cheese Burst",
        category: "base",
        price: 200,
        stock: 50,
        lowStockThreshold: 20,
    },
    {
        name: "Whole Wheat",
        category: "base",
        price: 170,
        stock: 50,
        lowStockThreshold: 20,
    },

    // Sauces
    {
        name: "Tomato Sauce",
        category: "sauce",
        price: 80,
        stock: 50,
        lowStockThreshold: 20,
    },
    {
        name: "BBQ Sauce",
        category: "sauce",
        price: 90,
        stock: 50,
        lowStockThreshold: 20,
    },
    {
        name: "Pesto Sauce",
        category: "sauce",
        price: 100,
        stock: 50,
        lowStockThreshold: 20,
    },
    {
        name: "Spicy Sauce",
        category: "sauce",
        price: 85,
        stock: 50,
        lowStockThreshold: 20,
    },
    {
        name: "Garlic Sauce",
        category: "sauce",
        price: 85,
        stock: 50,
        lowStockThreshold: 20,
    },

    // Cheese
    {
        name: "Mozzarella",
        category: "cheese",
        price: 120,
        stock: 50,
        lowStockThreshold: 20,
    },
    {
        name: "Cheddar",
        category: "cheese",
        price: 140,
        stock: 50,
        lowStockThreshold: 20,
    },
    {
        name: "Parmesan",
        category: "cheese",
        price: 160,
        stock: 50,
        lowStockThreshold: 20,
    },

    // Vegetables
    {
        name: "Onion",
        category: "vegetable",
        price: 30,
        stock: 50,
        lowStockThreshold: 20,
    },
    {
        name: "Capsicum",
        category: "vegetable",
        price: 40,
        stock: 50,
        lowStockThreshold: 20,
    },
    {
        name: "Mushroom",
        category: "vegetable",
        price: 60,
        stock: 50,
        lowStockThreshold: 20,
    },
    {
        name: "Olives",
        category: "vegetable",
        price: 50,
        stock: 50,
        lowStockThreshold: 20,
    },
    {
        name: "Sweet Corn",
        category: "vegetable",
        price: 40,
        stock: 50,
        lowStockThreshold: 20,
    },
]


const seedInventory = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        await Inventory.deleteMany();

        await Inventory.insertMany(inventoryData);

        console.log("Inventory seeded successfully");

        await mongoose.connection.close();
    } catch (error) {
        console.error("Failed to seed inventory:", error.message);
        process.exit(1);
    }
};

seedInventory();