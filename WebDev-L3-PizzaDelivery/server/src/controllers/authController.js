const User = require("../models/user");
const bcrypt = require('bcryptjs')
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

module.exports =  { registerUser }