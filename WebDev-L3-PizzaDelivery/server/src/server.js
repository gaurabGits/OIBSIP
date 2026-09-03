const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");
const paymentRoutes = require("./routes/paymentRouters");

app.use("/api/payment", paymentRoutes);

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, ()=>{
    console.log(`Server running on the ${PORT} port`); 
});