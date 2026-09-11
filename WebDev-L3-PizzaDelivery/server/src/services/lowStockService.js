const transporter = require("../config/mailer");
const Inventory = require("../models/inventory");

const checkLowStock = async () => {
  try {
    const recipient = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

    if (!recipient) {
      throw new Error("Missing ADMIN_EMAIL or EMAIL_USER for low-stock alerts");
    }

    const lowStockItems = await Inventory.find({
      $expr: {
        $lte: ["$stock", "$lowStockThreshold"],
      },
    });

    if (lowStockItems.length === 0) {
      console.log("No low-stock items.");
      return;
    }

    const itemList = lowStockItems
      .map(
        (item) =>
          `${item.name} (${item.category}) - Stock: ${item.stock}, Threshold: ${item.lowStockThreshold}`
      )
      .join("\n");

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipient,
      subject: "PizzaSlice - Low Stock Alert",
      text: `The following inventory items are low in stock:\n\n${itemList}`,
    });

    console.log("Low-stock email sent.");
  } catch (error) {
    console.error("Low-stock check error:", error);
  }
};

module.exports = {
  checkLowStock,
};