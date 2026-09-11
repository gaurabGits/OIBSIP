const cron = require("node-cron");
const { checkLowStock } = require("../services/lowStockService");

const startLowStockJob = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running daily low-stock check...");

    await checkLowStock();
  });

  console.log("Low-stock cron job started.");
};

module.exports = startLowStockJob;