const Pizza = require("../models/Pizza");


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


module.exports = {
    getPizzas,
    createPizza,
    getPizzaById,
    updatePizza,
    deletePizza
};