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

app.use(cors());
app.use(express.json());
app.use(
  cors({
    origin: [
      "*",
    ],
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

    if (!token) {
        return res.redirect(`${process.env.CLIENT_URL}/login/forgot-password`);
    }

    const clientUrl = process.env.CLIENT_URL;
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