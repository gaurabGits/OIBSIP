const Pizza = require("../models/Pizza");
const Inventory = require("../models/inventory");


const getPizzas = async (req, res) => {
    try {
        const { search, category, page = 1, limit = 10 } = req.query;

        const filter = {};

        if (search) {
            filter.name = {
                $regex: search,
                $options: "i",
            };
        }

        if (category) {
            filter.category = category;
        }

        const skip = (page - 1) * limit;

        const pizzas = await Pizza.find(filter)
            .skip(skip)
            .limit(Number(limit));

        const totalPizzas = await Pizza.countDocuments(filter);

        res.status(200).json({
            count: pizzas.length,
            total: totalPizzas,
            page: Number(page),
            totalPages: Math.ceil(totalPizzas / limit),
            pizzas,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


const createPizza = async (req, res) => {
    try {
        const { name, description, price, image, category } = req.body;

        if (!name || !description || !price || !image || !category) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const pizza = await Pizza.create({
            name,
            description,
            price,
            image,
            category,
        });

        res.status(201).json({
            message: "Pizza created successfully",
            pizza,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


const getPizzaById = async (req, res) => {
    try {
        const pizza = await Pizza.findById(req.params.id);

        if (!pizza) {
            return res.status(404).json({
                message: "Pizza not found",
            });
        }

        res.status(200).json({
            pizza,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


const updatePizza = async (req, res) => {
    try {
        const { name, description, price, image, category, isAvailable } = req.body || {};

        const pizza = await Pizza.findById(req.params.id);

        if (!pizza) {
            return res.status(404).json({
                message: "Pizza not found",
            });
        }

        pizza.name = name ?? pizza.name;
        pizza.description = description ?? pizza.description;
        pizza.price = price ?? pizza.price;
        pizza.image = image ?? pizza.image;
        pizza.category = category ?? pizza.category;
        pizza.isAvailable = isAvailable ?? pizza.isAvailable;

        const updatedPizza = await pizza.save();

        res.status(200).json({
            message: "Pizza updated successfully",
            pizza: updatedPizza,
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid pizza ID",
            });
        }

        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


const deletePizza = async (req, res) =>{
    try {
        const pizza = await Pizza.findById(req.params.id);

        if(!pizza){
            return res.status(404).json({
                message: "Pizza not found",
            });
        }

        await Pizza.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Pizza deleted sucessfully",
            pizza,
        });


    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
}


const calculateCustomPizza = async (req, res) => {
    try {
        const {
            baseId,
            sauceId,
            cheeseId,
            vegetableIds = [],
        } = req.body;

        if (!baseId || !sauceId || !cheeseId) {
            return res.status(400).json({
                message: "Base, sauce and cheese are required",
            });
        }

        const base = await Inventory.findOne({
            _id: baseId,
            category: "base",
            stock: { $gt: 0 },
        });

        const sauce = await Inventory.findOne({
            _id: sauceId,
            category: "sauce",
            stock: { $gt: 0 },
        });

        const cheese = await Inventory.findOne({
            _id: cheeseId,
            category: "cheese",
            stock: { $gt: 0 },
        });

        const vegetables = await Inventory.find({
            _id: { $in: vegetableIds },
            category: "vegetable",
            stock: { $gt: 0 },
        });

        if (!base || !sauce || !cheese) {
            return res.status(400).json({
                message: "Selected base, sauce or cheese is unavailable",
            });
        }

        if (vegetables.length !== vegetableIds.length) {
            return res.status(400).json({
                message: "One or more selected vegetables are unavailable",
            });
        }

        const totalPrice =
            base.price +
            sauce.price +
            cheese.price +
            vegetables.reduce((total, vegetable) => {
                return total + vegetable.price;
            }, 0);

        res.status(200).json({
            message: "Custom pizza calculated successfully",
            pizza: {
                base,
                sauce,
                cheese,
                vegetables,
                totalPrice,
            },
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};



module.exports = {
    getPizzas,
    createPizza,
    getPizzaById,
    updatePizza,
    deletePizza,
    calculateCustomPizza,
};