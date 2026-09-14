const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const pizzaRoutes = require("./routes/pizzaRoutes");
const adminRoutes = require("./routes/adminRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRouters");
const storeRoutes = require("./routes/storeRoutes");

const app = express();

const getClientUrl = () => (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");

const parseAllowedOrigins = () => {
    const localOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
    const configuredOrigins = [process.env.CLIENT_URL, ...(process.env.ALLOWED_ORIGINS || "").split(",")]
        .map((origin) => origin?.trim())
        .filter(Boolean);

    return [...new Set([...localOrigins, ...configuredOrigins])].map((origin) => origin.replace(/\/$/, ""));
};

const allowedOrigins = parseAllowedOrigins();

app.use(express.json());
app.use(
    cors({
        origin(origin, callback) {
            const normalizedOrigin = origin?.replace(/\/$/, "");

            if (!origin || allowedOrigins.includes(normalizedOrigin)) {
                return callback(null, true);
            }

            return callback(new Error(`CORS blocked request from origin: ${origin}`));
        },
        credentials: true,
    })
);

app.get("/", (req, res) => {
    res.json({
        message: "Pizza delivery API is running",
    });
});

app.get("/reset-password", (req, res) => {
    const token = req.query.token;
    const clientUrl = getClientUrl();

    if (!token) {
        return res.redirect(`${clientUrl}/login/forgot-password`);
    }

    return res.redirect(`${clientUrl}/reset-password?token=${encodeURIComponent(token)}`);
});

app.use("/api/auth", authRoutes);
app.use("/api/pizza", pizzaRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/store", storeRoutes);

module.exports = app;
