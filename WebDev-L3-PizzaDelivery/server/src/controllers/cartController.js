const Cart = require("../models/cart");

const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });

  res.json({
    items: cart ? cart.items : [],
  });
};

const replaceCart = async (req, res) => {
  const items = req.body.items;

  if (!Array.isArray(items)) {
    return res.status(400).json({
      message: "Invalid cart items",
    });
  }

  const cart = await Cart.findOneAndUpdate(
    { user: req.user.id },
    {
      user: req.user.id,
      items,
    },
    {
      new: true,
      upsert: true,
    }
  );

  res.json({
    items: cart.items,
  });
};

const clearCart = async (req, res) => {
  await Cart.findOneAndUpdate(
    { user: req.user.id },
    { items: [] },
    { upsert: true }
  );

  res.json({
    items: [],
  });
};

module.exports = {
  getCart,
  replaceCart,
  clearCart,
};