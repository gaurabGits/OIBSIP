const StoreSettings = require("../models/storeSettings");

const getStoreSettings = async (req, res) => {
  try {
    const settings = await StoreSettings.findOneAndUpdate(
      { key: "main" },
      { $setOnInsert: { key: "main", isOpen: true } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    return res.status(200).json({ isOpen: settings.isOpen });
  } catch (error) {
    return res.status(500).json({ message: "Could not load store status" });
  }
};

const updateStoreSettings = async (req, res) => {
  try {
    const { isOpen } = req.body || {};

    if (typeof isOpen !== "boolean") {
      return res.status(400).json({ message: "isOpen must be a boolean" });
    }

    const settings = await StoreSettings.findOneAndUpdate(
      { key: "main" },
      { $set: { isOpen } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    return res.status(200).json({ isOpen: settings.isOpen });
  } catch (error) {
    return res.status(500).json({ message: "Could not update store status" });
  }
};

module.exports = { getStoreSettings, updateStoreSettings };