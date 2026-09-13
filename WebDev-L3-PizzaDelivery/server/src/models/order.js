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
            },

            sauce: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Inventory",
            },

            cheese: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Inventory",
            },

            vegetables: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Inventory",
                },
            ],
        },

        items: [
            {
                itemId: { type: String, required: true },
                pizzaId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Pizza",
                },
                name: { type: String, required: true },
                price: { type: Number, required: true, min: 0 },
                quantity: { type: Number, required: true, min: 1 },
                size: String,
                dough: String,
                ingredients: String,
                ingredientIds: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Inventory",
                    },
                ],
                image: String,
            },
        ],

        address: {
            fullName: { type: String, required: true, trim: true },
            phone: { type: String, required: true, trim: true },
            line: { type: String, required: true, trim: true },
            city: { type: String, required: true, trim: true },
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
            enum: ["esewa", "cash"],
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
        paymentFailureReason: {
            type: String,
            trim: true,
        },
        cancelledBy: {
            type: String,
            enum: ["user", "admin", "system"],
        },
        cancellationReason: {
            type: String,
            trim: true,
        },
        cancelledAt: {
            type: Date,
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