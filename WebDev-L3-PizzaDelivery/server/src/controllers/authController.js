const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


const User = require("../models/user");
const { 
    sendVerificationEmail,
    sendPasswordResetEmail,
 } = require("../services/emailService")


const emailRegex = /^\S+@\S+\.\S+$/;
const phoneRegex = /^9\d{9}$/;


const registerUser = async (req, res) => {
    try{
        const fname = req.body.fname?.trim();
        const phone = req.body.phone?.trim();
        const email = req.body.email?.trim().toLowerCase();
        const { password } = req.body;

        if(!fname || !phone || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        if (fname.length < 2) {
            return res.status(400).json({
                message: "Full name is too short",
            });
        }

        if (!phoneRegex.test(phone)) {
            return res.status(400).json({
                message: "Enter a valid 10-digit phone number",
            });
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Enter a valid email",
            });
        }

        if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters and include letters and numbers",
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

        const verificationCode = crypto.randomInt(100000, 1000000).toString();
        const verificationExpires = Date.now() + 15 * 60 * 1000;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fname,
            phone,
            email,
            password: hashedPassword,
            emailVerificationCode: verificationCode,
            emailVerificationExpires: verificationExpires,
        });

        try {
            await sendVerificationEmail(user.email, verificationCode);
        } catch (emailError) {
             console.error("Email send failed:", emailError); 
            await User.findByIdAndDelete(user._id);

            return res.status(500).json({
                message: "Unable to send verification email",
            });
        }

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
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(409).json({
                message: `${field} already registered`,
            });
        }

        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


const verifyEmail = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();
        const code = req.body.code?.trim();

        if (!email || !emailRegex.test(email) || !/^\d{6}$/.test(code || "")) {
            return res.status(400).json({
                message: "Enter the valid six-digit verification code",
            });
        }

        const user = await User.findOne({
            email,
            emailVerificationCode: code,
            emailVerificationExpires: { $gt: Date.now() },
        }).select("+emailVerificationCode +emailVerificationExpires");

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired verification code",
            });
        }

        user.isEmailVerified = true;
        user.emailVerificationCode = undefined;
        user.emailVerificationExpires = undefined;

        await user.save();

        const sessionToken = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Email verified successfully",
            token: sessionToken,
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

const resendVerificationEmail = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();

        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({ message: "Enter a valid email" });
        }

        const user = await User.findOne({ email });
        if (!user || user.isEmailVerified) {
            return res.status(200).json({
                message: "If the account needs verification, a new email has been sent",
            });
        }

        const verificationCode = crypto.randomInt(100000, 1000000).toString();
        user.emailVerificationCode = verificationCode;
        user.emailVerificationExpires = Date.now() + 15 * 60 * 1000;
        await user.save();
        await sendVerificationEmail(user.email, verificationCode);

        return res.status(200).json({ message: "Verification email sent" });
    } catch (error) {
        return res.status(500).json({ message: "Unable to send verification email" });
    }
};


const loginUser = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();
        const { password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Enter a valid email",
            });
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        if (!user.isEmailVerified) {
            return res.status(403).json({
                message: "Please verify your email before logging in",
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

        if (user.role === "admin") {
        return res.status(403).json({
            message: "Access denied. Use the designated admin login portal.",
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


const forgotPassword = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();

        if (!email) {
            return res.status(400).json({
                message: "Email is required",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        const resetExpires = Date.now() + 15 * 60 * 1000;

        user.passwordResetToken = resetToken;
        user.passwordResetExpires = resetExpires;

        await user.save();

        await sendPasswordResetEmail(user.email, resetToken);

        res.status(200).json({
            message: "Password reset email sent",
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.query;
        const { password } = req.body;

        if (!token) {
            return res.status(400).json({
                message: "Reset token is required",
            });
        }

        if (!password) {
            return res.status(400).json({
                message: "New password is required",
            });
        }

        if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters and include letters and numbers",
            });
        }

        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() },
        }).select("+passwordResetToken +passwordResetExpires");

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired reset token",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save();

        res.status(200).json({
            message: "Password reset successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};



module.exports = { 
    registerUser, 
    verifyEmail, 
    resendVerificationEmail,
    loginUser, 
    forgotPassword,
    resetPassword,
    getMe,  
}