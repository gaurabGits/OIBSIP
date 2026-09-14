const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");
const startLowStrockJob = require("./jobs/lowStockJob");

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

startLowStrockJob();
