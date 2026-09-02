const Order = require("../models/order");
const Inventory = require("../models/inventory");

const createOrder = async (req, res) => {
  try {
    const { 
        baseId, 
        sauceId, 
        cheeseId, 
        vegetableIds = [], } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "Not authorized, user missing",
      });
    }

    // 1. Check required ingredients
    if (!baseId || !sauceId || !cheeseId) {
      return res.status(400).json({
        message: "Base, sauce and cheese are required",
      });
    }


    // 2. Find selected ingredients
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


    // 3. Check availability
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


    // 4. Calculate total price from database
    const totalPrice =
      base.price +
      sauce.price +
      cheese.price +
      vegetables.reduce((total, vegetable) => {
        return total + vegetable.price;
      }, 0);


    // 5. Create order
    const order = await Order.create({
      user:  req.user?.id, // id of currently logged in user

      pizza: {
        base: base._id,
        sauce: sauce._id,
        cheese: cheese._id,
        vegetables: vegetables.map(
          (vegetable) => vegetable._id
        ),
      },

      totalPrice,

      status: "Order Received",

      paymentStatus: "Pending",
    });


    // 6. Decrease inventory stock 
    await Inventory.findByIdAndUpdate(base._id, {
      $inc: { stock: -1 }, //$inc used to increase and decrease the value
    });

    await Inventory.findByIdAndUpdate(sauce._id, {
      $inc: { stock: -1 },
    });

    await Inventory.findByIdAndUpdate(cheese._id, {
      $inc: { stock: -1 },
    });

    for (const vegetable of vegetables) {
      await Inventory.findByIdAndUpdate(vegetable._id, {
        $inc: { stock: -1 },
      });
    }


    // 7. Send response
    res.status(201).json({
      message: "Order created successfully",
      order,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user?.id, 
        })
            //populate: used to get the data of the referenced document in the response
            .populate("user", "fname phone email")
            .populate("pizza.base", "name price")
            .populate("pizza.sauce", "name price")
            .populate("pizza.cheese", "name price")
            .populate("pizza.vegetables", "name price")
            .sort({ createdAt: -1 }); //sort by createdAt in descending order

        res.status(200).json({
            count: orders.length,
            orders,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

module.exports = {
  createOrder,
  getMyOrders,
};