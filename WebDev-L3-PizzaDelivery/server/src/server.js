const dotenv = require("dotenv");
dotenv.config();

const isHosted = process.env.RENDER || process.env.VERCEL;
const mode = process.env.NODE_ENV || (isHosted ? "production" : "development");

if (mode !== "production" && !isHosted) {
    dotenv.config({ path: `.env.${mode}`, override: true });
}

const app = require("./app");
const connectDB = require("./config/db");
const startLowStrockJob = require("./jobs/lowStockJob");

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});

startLowStrockJob();