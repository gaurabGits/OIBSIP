const User = require("../models/user");

const admin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("role");

        if (!user || user.role !== "admin") {
        return res.status(403).json({
            message: "Admin access required",
        });
    }

    next();
    } catch (error) {
        return res.status(401).json({
            message: "Not authorized",
        });
    }
};

module.exports = admin;