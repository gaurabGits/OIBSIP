const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        pizza: {
            base: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Inventory",
                required: true,
            },

            sauce: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Inventory",
                required: true,
            },

            cheese: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Inventory",
                required: true,
            },

            vegetables: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Inventory",
                },
            ],
        },

        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        status: {
            type: String,
            enum: [
                "Order Received",
                "In Kitchen",
                "Sent to Delivery",
                "Delivered",
                "Cancelled",
            ],
            default: "Order Received",
        },
      
        paymentMethod: {
            type: String,
            enum: ["esewa", "razorpay", "cash"],
            required: true,
        },
        
        transactionUuid:{
            type: String,
            unique: true,
            sparse: true,
        },

        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Failed"],
            default: "Pending",
        },
        stockDeducted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order", orderSchema);