const User = require("../models/user");
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try{
        const {fname, phone, email, password} = req.body;

        if(!fname || !phone || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const existingEmail = await User.findOne({ email });
        const existingPhone = await User.findOne({ phone });

        if (existingEmail) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        if (existingPhone) {
            return res.status(409).json({
                message: "Phone number already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fname, phone, email, password: hashedPassword,
        });

        res.status(201).json({
            message: "User registered Successfully",
            user: {
                id: user._id,
                fname: user.fname,
                phone: user.phone,
                email: user.email,
                role: user.role
            },
        });
    }catch(error){
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        )

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                fname: user.fname,
                phone: user.phone,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


const getMe = async (req, res) => {
    try{
        const user = await User.findById(req.user.id);

        if(!user){
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json({
            user: {
                id: user._id,
                fname: user.fname,
                phone: user.phone,
                email: user.email,
                role: user.role,
            }
        });
    }catch(error){
        res.status(500).json({
            message: "Server error",
            error: error.message,
        })
    }
}

module.exports = { registerUser, loginUser, getMe }