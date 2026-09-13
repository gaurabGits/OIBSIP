const mongoose = require("mongoose");

const storeSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: "main" },
    isOpen: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("StoreSettings", storeSettingsSchema);