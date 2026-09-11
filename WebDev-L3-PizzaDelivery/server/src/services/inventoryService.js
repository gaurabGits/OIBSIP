const mongoose = require("mongoose");
const Inventory = require("../models/inventory");

const deductInventory = async (order) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const inventoryIds = [
      order.pizza.base,
      order.pizza.sauce,
      order.pizza.cheese,
      ...order.pizza.vegetables,
    ];

    for (const inventoryId of inventoryIds) {
      const updatedItem = await Inventory.findOneAndUpdate(
        {
          _id: inventoryId,
          stock: { $gt: 0 },
        },
        {
          $inc: { stock: -1 },
        },
        {
          returnDocument: "after",
          session,
        }
      );

      if (!updatedItem) {
        throw new Error(
          `Insufficient stock for inventory item ${inventoryId}`
        );
      }
    }

    await session.commitTransaction();

    return true;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

module.exports = {
  deductInventory,
};