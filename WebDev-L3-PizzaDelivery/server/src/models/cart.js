const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      required: true,
    },
    pizzaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pizza",
    },
    name: {
      type: String,
      required: true,
    },
    image: String,
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    dough: String,
    size: String,
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    isCustom: {
      type: Boolean,
      default: false,
    },
    ingredients: String,
    ingredientIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);