const mongoose = require("mongoose");
const Order = require("../models/order");
const Inventory = require("../models/inventory");
const {
  ESEWA_PRODUCT_CODE,
  ESEWA_PAYMENT_URL,
  generateSignature,
  verifySignature,
} = require("../config/esewa");


const createEsewaPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.user?.id || req.user?._id;

    if (!orderId) {
      return res.status(400).json({
        message: "Order ID is required",
      });
    }

    if (!userId) {
      return res.status(401).json({
        message: "Not authorized, user missing",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if ((order.paymentMethod || "").toLowerCase() !== "esewa") {
      return res.status(400).json({
        message: "This order is not using eSewa",
      });
    }

    if (order.paymentStatus === "Paid") {
      return res.status(400).json({
        message: "Order is already paid",
      });
    }

    const transactionUuid = `TXN-${Date.now()}`;

    const signature = generateSignature(
      order.totalPrice,
      transactionUuid
    );

    order.transactionUuid = transactionUuid;

    await order.save();

    res.status(200).json({
      message: "eSewa payment created",

      payment: {
        amount: order.totalPrice,
        tax_amount: 0,
        total_amount: order.totalPrice,

        transaction_uuid: transactionUuid,

        product_code: ESEWA_PRODUCT_CODE,

        product_service_charge: 0,
        product_delivery_charge: 0,

        success_url:
          "http://localhost:5000/api/payment/esewa/success",

        failure_url:
          "http://localhost:5000/api/payment/esewa/failure",

        signed_field_names:
          "total_amount,transaction_uuid,product_code",

        signature,

        payment_url: ESEWA_PAYMENT_URL,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


const esewaSuccess = async (req, res) => {
  try {
    const { data } = req.query;

    if (!data) {
      return res.status(400).json({
        message: "eSewa response data is missing",
      });
    }

    // Decode Base64 response
    const decodedData = Buffer.from(
      data,
      "base64"
    ).toString("utf-8");

    const paymentData = JSON.parse(decodedData);

    console.log("eSewa response:", paymentData);

    // Verify eSewa response signature
    const isValid = verifySignature(paymentData);

    if (!isValid) {
      return res.status(400).json({
        message: "Invalid eSewa payment signature",
      });
    }

    // Check response belongs to our merchant
    if (
      paymentData.product_code !== ESEWA_PRODUCT_CODE
    ) {
      return res.status(400).json({
        message: "Invalid eSewa product code",
      });
    }

    // Find order using transaction UUID
    const order = await Order.findOne({
      transactionUuid:
        paymentData.transaction_uuid,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found for this transaction",
      });
    }

    // Verify amount
    if (
      Number(paymentData.total_amount) !==
      Number(order.totalPrice)
    ) {
      return res.status(400).json({
        message: "Payment amount does not match order amount",
      });
    }

    // Prevent duplicate processing
    if (order.paymentStatus === "Paid") {
      return res.status(200).json({
        message: "Payment already verified",
        order,
      });
    }

    // Check transaction status with eSewa
    const statusData =
      await verifyEsewaTransaction(order);

    console.log(
      "eSewa status:",
      statusData
    );

    if (statusData.status !== "COMPLETE") {
      order.paymentStatus = "Failed";

      await order.save();

      return res.status(400).json({
        message: "eSewa payment was not completed",
        status: statusData.status,
      });
    }

    // Make sure status API also matches our transaction
    if (
      statusData.transaction_uuid !==
      order.transactionUuid
    ) {
      return res.status(400).json({
        message:
          "Transaction UUID verification failed",
      });
    }

    // Deduct inventory
    if (!order.stockDeducted) {
      await deductInventory(order);
    }

    // Mark payment as paid
    order.paymentStatus = "Paid";
    order.status = "Order Received";

    await order.save();

    res.status(200).json({
      message: "eSewa payment verified successfully",
      order,
    });
  } catch (error) {
    console.error("eSewa success error:", error);

    res.status(500).json({
      message: "Failed to verify eSewa payment",
      error: error.message,
    });
  }
};


const esewaFailure = async (req, res) => {
  try {
    const { data } = req.query;

    // eSewa may not always provide response data
    if (!data) {
      return res.status(200).json({
        message: "eSewa payment failed or cancelled",
      });
    }

    const decodedData = Buffer.from(
      data,
      "base64"
    ).toString("utf-8");

    const paymentData = JSON.parse(decodedData);

    const order = await Order.findOne({
      transactionUuid:
        paymentData.transaction_uuid,
    });

    if (order && order.paymentStatus !== "Paid") {
      order.paymentStatus = "Failed";

      await order.save();
    }

    res.status(200).json({
      message: "eSewa payment failed or cancelled",
    });
  } catch (error) {
    console.error(
      "eSewa failure error:",
      error
    );

    res.status(500).json({
      message: "Failed to process eSewa failure",
      error: error.message,
    });
  }
};


const deductInventory = async (order) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const inventoryIds = [
      order.pizza?.base,
      order.pizza?.sauce,
      order.pizza?.cheese,
      ...(order.pizza?.vegetables || []),
    ].filter(Boolean);

    for (const inventoryId of inventoryIds) {
      const updatedItem = await Inventory.findOneAndUpdate(
        {
          _id: inventoryId,
          stock: { $gt: 0 },
        },
        {
          $inc: { stock: -1 },
        },
        {
          new: true,
          session,
        }
      );

      if (!updatedItem) {
        throw new Error(
          `Insufficient stock for inventory item ${inventoryId}`
        );
      }
    }

    order.stockDeducted = true;
    order.paymentStatus = "Paid";
    order.status = "Order Received";

    await order.save({ session });
    await session.commitTransaction();
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    throw error;
  } finally {
    session.endSession();
  }
};

const verifyEsewaTransaction = async (order) => {
  const statusUrl = new URL(
    process.env.ESEWA_STATUS_URL
  );

  statusUrl.searchParams.set(
    "product_code",
    ESEWA_PRODUCT_CODE
  );

  statusUrl.searchParams.set(
    "total_amount",
    order.totalPrice
  );

  statusUrl.searchParams.set(
    "transaction_uuid",
    order.transactionUuid
  );

  const response = await fetch(statusUrl);

  if (!response.ok) {
    throw new Error(
      `eSewa status API returned ${response.status}`
    );
  }

  const data = await response.json();

  return data;
};


module.exports = {
  createEsewaPayment,
  esewaSuccess,
  esewaFailure,
};
