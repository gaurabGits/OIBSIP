const Order = require("../models/order");

const {
  ESEWA_PRODUCT_CODE,
  ESEWA_PAYMENT_URL,
  generateSignature,
} = require("../config/esewa");

const createEsewaPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        message: "Order ID is required",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      user: req.user?.id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.paymentMethod !== "esewa") {
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
        success_url: "http://localhost:5000/api/payment/esewa/success",
        failure_url: "http://localhost:5000/api/payment/esewa/failure",
        signed_field_names:
          "total_amount,transaction_uuid,product_code",
        signature,
        payment_url: ESEWA_PAYMENT_URL,
      },
    });
  } catch (error) {
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

    // eSewa sends Base64 encoded response
    const decodedData = Buffer.from(data, "base64").toString("utf-8");

    const paymentData = JSON.parse(decodedData);

    console.log("eSewa response:", paymentData);

    res.status(200).json({
      message: "eSewa payment response received",
      paymentData,
    });
  } catch (error) {
    res.status(500).json({
      message: "eSewa payment failed or cancelled",
      error: error.message,
    });
  }
};

const esewaFailure = async (req, res) => {
  res.status(200).json({
    message: "eSewa payment failed or cancelled",
  });
};


module.exports = {
  createEsewaPayment,
  esewaSuccess,
  esewaFailure,
};
