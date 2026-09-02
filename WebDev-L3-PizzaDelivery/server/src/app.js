const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const pizzaRoutes = require("./routes/pizzaRoutes");
const adminRoutes = require("./routes/adminRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Pizza delivery API is running",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/pizza", pizzaRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/inventory", inventoryRoutes);


module.exports = app;