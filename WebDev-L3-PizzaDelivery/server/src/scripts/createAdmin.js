const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/user");

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const existingAdmin = await User.findOne({
            email: "admin@pizzaslice.com",
        });

        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash("Admin@123456", 10);

        await User.create({
            fname: "PizzaSlice Admin",
            phone: "9800000000",
            email: "admin@pizzaslice.com",
            password: hashedPassword,
            role: "admin",
            isEmailVerified: true,
        });

        console.log("Admin created successfully");

        process.exit(0);
    } catch (error) {
        console.error("Failed to create admin:", error.message);
        process.exit(1);
    }
};

createAdmin();
