const User = require("../models/user");

const user = async (req, res, next) => {
    try {
        const account = await User.findById(req.user.id).select("role");

        if (!account || account.role !== "user") {
            return res.status(403).json({
                message: "Customer access required",
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Not authorized",
        });
    }
};

module.exports = user;