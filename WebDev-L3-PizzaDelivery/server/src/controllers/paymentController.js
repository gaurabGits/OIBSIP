const Order = require("../models/order");
const {
  ESEWA_PRODUCT_CODE,
  ESEWA_PAYMENT_URL,
  generateSignature,
  verifySignature,
} = require("../config/esewa");
const { deductInventory } = require("../services/inventoryService");

const getClientUrl = () => process.env.CLIENT_URL || "http://localhost:5173";


const createEsewaPayment = async (req, res) => {
  try {
    const { orderId } = req.body || {};
    const userId = req.user?.id || req.user?._id;

    if (!orderId) {
      return res.status(400).json({
        message: "Order ID is required",
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

    if (order.paymentMethod !== "esewa") {
      return res.status(400).json({
        message: "This order is not an eSewa order",
      });
    }

    if (order.paymentStatus === "Paid") {
      return res.status(400).json({
        message: "Order payment is already complete",
      });
    }

    if (!order.transactionUuid) {
      order.transactionUuid = `${order._id}-${Date.now()}`;
      await order.save();
    }

    const amount = Number(order.totalPrice).toFixed(2);
    const signedFieldNames = "total_amount,transaction_uuid,product_code";
    const callbackBaseUrl =
      process.env.SERVER_URL || `${req.protocol}://${req.get("host")}`;

    return res.status(200).json({
      paymentUrl: ESEWA_PAYMENT_URL,
      formData: {
        amount,
        tax_amount: "0",
        total_amount: amount,
        transaction_uuid: order.transactionUuid,
        product_code: ESEWA_PRODUCT_CODE,
        product_service_charge: "0",
        product_delivery_charge: "0",
        success_url: `${callbackBaseUrl}/api/payment/esewa/success`,
        failure_url: `${callbackBaseUrl}/api/payment/esewa/failure`,
        signed_field_names: signedFieldNames,
        signature: generateSignature(amount, order.transactionUuid),
      },
    });
  } catch (error) {
    console.error("Create eSewa payment error:", error);

    return res.status(500).json({
      message: "Failed to create eSewa payment",
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
      return res.redirect(`${getClientUrl()}/orders?payment=success`);
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
      order.status = "Cancelled";

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
    if (!order.stockDeducted && order.items?.length === 0) {
      await deductInventory(order);
    }

    // Mark payment as paid
    order.stockDeducted = true;
    order.paymentStatus = "Paid";
    order.status = "Order Received";

    await order.save();

    return res.redirect(`${getClientUrl()}/orders?payment=success`);
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
      return res.redirect(`${getClientUrl()}/orders?payment=failure`);
    }

    const decodedData = Buffer.from(
      data,
      "base64"
    ).toString("utf-8");

    const paymentData = JSON.parse(decodedData);

    if (!verifySignature(paymentData) || paymentData.product_code !== ESEWA_PRODUCT_CODE) {
      return res.status(400).json({
        message: "Invalid eSewa payment failure signature",
      });
    }

    const order = await Order.findOne({
      transactionUuid:
        paymentData.transaction_uuid,
    });

    if (order && order.paymentStatus !== "Paid") {
      order.paymentStatus = "Failed";
      order.status = "Cancelled";

      await order.save();
    }

    return res.redirect(`${getClientUrl()}/orders?payment=failure`);
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
