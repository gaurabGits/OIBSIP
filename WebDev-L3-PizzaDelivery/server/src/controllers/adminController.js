const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("fname phone email role isEmailVerified createdAt")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: users.length,
            users,
        });
    } catch (error) {
        console.error("Get users error:", error);

        res.status(500).json({
            message: "Could not load users",
            error: error.message,
        });
    }
};

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const admin = await User.findOne({ email }).select("+password");

        if (!admin) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        if (admin.role !== "admin") {
            return res.status(403).json({
                message: "Access denied",
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        if (!admin.isEmailVerified) {
            return res.status(403).json({
                message: "Please verify your email before logging in",
            });
        }

        const token = jwt.sign(
            {
                id: admin._id,
                role: admin.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.status(200).json({
            message: "Admin login successful",
            token,
            admin: {
                id: admin._id,
                fname: admin.fname,
                email: admin.email,
                role: admin.role,
            },
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

module.exports = {
    adminLogin,
    getUsers,
};
