const Order = require("../models/order");
const Inventory = require("../models/inventory");
const { deductInventory, restoreInventory } = require("../services/inventoryService");
const StoreSettings = require("../models/storeSettings");
const DELIVERY_FEE = 60;
const ORDER_STATUS_FLOW = [
  "Order Received",
  "In Kitchen",
  "Sent to Delivery",
  "Delivered",
];

const createOrder = async (req, res) => {
  try {
    const {
      baseId,
      sauceId,
      cheeseId,
      vegetableIds = [],
      paymentMethod,
      items = [],
      address,
    } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Not authorized, user missing",
      });
    }

    const storeSettings = await StoreSettings.findOne({ key: "main" });
    if (storeSettings && !storeSettings.isOpen) {
      return res.status(423).json({
        message: "We are busy right now. Please try again in a few hours.",
      });
    }

    const normalizedPaymentMethod = String(paymentMethod || "")
      .trim()
      .toLowerCase();

    if (!["esewa", "cash"].includes(normalizedPaymentMethod)) {
      return res.status(400).json({
        message: "Invalid payment method",
      });
    }

    if (items.length > 0) {
      if (!address?.fullName || !address?.phone || !address?.line || !address?.city) {
        return res.status(400).json({ message: "Delivery address is required" });
      }

      const normalizedItems = items.map((item) => ({
        itemId: String(item.itemId || ""),
        name: String(item.name || "").trim(),
        price: Number(item.price),
        quantity: Number(item.quantity),
        size: item.size,
        dough: item.dough,
        ingredients: item.ingredients,
        ingredientIds: Array.isArray(item.ingredientIds)
          ? item.ingredientIds
          : [],
        image: item.image,
      }));

      if (normalizedItems.some((item) => !item.itemId || !item.name || !Number.isFinite(item.price) || item.price < 0 || !Number.isInteger(item.quantity) || item.quantity < 1)) {
        return res.status(400).json({ message: "Invalid cart items" });
      }

      const subtotal = normalizedItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );
      const totalPrice = subtotal + DELIVERY_FEE;
      const order = await Order.create({
        user: userId,
        items: normalizedItems,
        address,
        totalPrice,
        paymentMethod: normalizedPaymentMethod,
        status: "Order Received",
        paymentStatus: "Pending",
        stockDeducted: false,
      });

      if (normalizedPaymentMethod === "cash") {
        try {
          await deductInventory(order);
          order.stockDeducted = order.items.some(
            (item) => item.ingredientIds.length > 0
          );
          await order.save();
        } catch (error) {
          await Order.findByIdAndDelete(order._id);

          return res.status(400).json({
            message: "Unable to create order because stock is insufficient",
            error: error.message,
          });
        }
      }


      return res.status(201).json({
        message: "Order created successfully",
        order,
      });
    }

    if (!baseId || !sauceId || !cheeseId) {
      return res.status(400).json({
        message: "Base, sauce and cheese are required",
      });
    }

    // Get pizza price from inventory
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

    if (!base || !sauce || !cheese) {
      return res.status(400).json({
        message: "One or more selected ingredients are unavailable",
      });
    }

    const vegetables = await Inventory.find({
      _id: { $in: vegetableIds },
      category: "vegetable",
      stock: { $gt: 0 },
    });

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

    // Create order first
    const order = await Order.create({
      user: userId,

      pizza: {
        base: base._id,
        sauce: sauce._id,
        cheese: cheese._id,
        vegetables: vegetables.map((vegetable) => vegetable._id),
      },

      totalPrice,

      paymentMethod: normalizedPaymentMethod,

      status: "Order Received",

      paymentStatus: "Pending",

      stockDeducted: false,
    });

    // Cash payment
    if (normalizedPaymentMethod === "cash") {
      try {
        await deductInventory(order);

        order.stockDeducted = true;

        await order.save();
      } catch (error) {
        // If stock deduction fails, remove the order
        if (order.stockDeducted) {
          await restoreInventory(order);
        }
        await Order.findByIdAndDelete(order._id);

        return res.status(400).json({
          message: "Unable to create order because stock is insufficient",
          error: error.message,
        });
      }
    }

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);

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

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "fname phone email")
            .populate("pizza.base", "name price")
            .populate("pizza.sauce", "name price")
            .populate("pizza.cheese", "name price")
            .populate("pizza.vegetables", "name price")
            .sort({ createdAt: -1 });

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

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body || {};

        if (!status) {
            return res.status(400).json({
                message: "Order status is required",
            });
        }

        if (![...ORDER_STATUS_FLOW, "Cancelled"].includes(status)) {
            return res.status(400).json({
                message: "Invalid order status",
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        if (order.status === "Cancelled" && status !== "Cancelled") {
          return res.status(400).json({
            message: "Cancelled orders cannot be reopened",
          });
        }

        if (status === "Cancelled") {
          return res.status(400).json({
            message: "Customers must cancel orders from their order history",
          });
        }

        const currentStatusIndex = ORDER_STATUS_FLOW.indexOf(order.status);
        const nextStatusIndex = ORDER_STATUS_FLOW.indexOf(status);

        if (
          currentStatusIndex === -1 ||
          nextStatusIndex < currentStatusIndex
        ) {
          return res.status(400).json({
            message: "Order status cannot move backwards",
          });
        }

        if (status === "Cancelled" && order.status !== "Cancelled" && order.stockDeducted) {
          await restoreInventory(order);
          order.stockDeducted = false;
        }

        order.status = status;
        await order.save();

        res.status(200).json({
            message: "Order status updated successfully",
            order,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

const cancelMyOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user?.id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "Order Received") {
      return res.status(400).json({
        message: "This order has entered the kitchen and cannot be cancelled",
      });
    }

    const twentyMinutes = 20 * 60 * 1000;
    if (Date.now() - new Date(order.createdAt).getTime() > twentyMinutes) {
      return res.status(400).json({
        message: "Orders can only be cancelled within 20 minutes",
      });
    }

    if (order.stockDeducted) {
      await restoreInventory(order);
      order.stockDeducted = false;
    }

    order.status = "Cancelled";
    await order.save();

    return res.status(200).json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    return res.status(500).json({
      message: "Could not cancel order",
      error: error.message,
    });
  }
};

const markCashPaymentPaid = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.paymentMethod !== "cash") {
      return res.status(400).json({
        message: "This order is not a Cash on Delivery order",
      });
    }

    if (order.paymentStatus === "Paid") {
      return res.status(400).json({
        message: "Payment is already marked as paid",
      });
    }

    order.paymentStatus = "Paid";

    await order.save();

    res.status(200).json({
      message: "Cash payment marked as paid",
      order,
    });
  } catch (error) {
    console.error("Mark cash payment error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelMyOrder,
  markCashPaymentPaid,
};

