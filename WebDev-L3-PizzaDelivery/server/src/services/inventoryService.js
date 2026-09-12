const mongoose = require("mongoose");
const Inventory = require("../models/inventory");

const getInventoryQuantities = (order) => {
  const pizza = order.pizza || {};
  const pizzaIngredientIds = [
    pizza.base,
    pizza.sauce,
    pizza.cheese,
    ...(pizza.vegetables || []),
  ].filter(Boolean);

  if (pizzaIngredientIds.length) {
    return pizzaIngredientIds.reduce((quantities, ingredientId) => {
      const key = ingredientId.toString();
      quantities[key] = (quantities[key] || 0) + 1;
      return quantities;
    }, {});
  }

  return (order.items || []).reduce((quantities, item) => {
    (item.ingredientIds || []).forEach((ingredientId) => {
      const key = ingredientId.toString();
      quantities[key] = (quantities[key] || 0) + item.quantity;
    });
    return quantities;
  }, {});
};

const getInventoryEntries = (order) => {
  const quantities = getInventoryQuantities(order);

  return Object.entries(quantities);
};

const deductInventory = async (order) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const inventoryEntries = getInventoryEntries(order);

    for (const [inventoryId, quantity] of inventoryEntries) {
      const updatedItem = await Inventory.findOneAndUpdate(
        {
          _id: inventoryId,
          stock: { $gte: quantity },
        },
        {
          $inc: { stock: -quantity },
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

const restoreInventory = async (order) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const inventoryEntries = getInventoryEntries(order);

    for (const [inventoryId, quantity] of inventoryEntries) {
      await Inventory.updateOne(
        { _id: inventoryId },
        { $inc: { stock: quantity } },
        { session }
      );
    }

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

module.exports = {
  deductInventory,
  restoreInventory,
};