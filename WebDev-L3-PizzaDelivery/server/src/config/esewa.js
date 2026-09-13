const crypto = require("crypto");

const ESEWA_PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE;
const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY;
const ESEWA_PAYMENT_URL = process.env.ESEWA_PAYMENT_URL;


const generateSignature = (totalAmount, transactionUuid) => {
  const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${ESEWA_PRODUCT_CODE}`;

  return crypto
    .createHmac("sha256", ESEWA_SECRET_KEY)
    .update(message)
    .digest("base64");
};


const generateResponseSignature = (paymentData) => {
  const signedFieldNames = paymentData.signed_field_names.split(",");

  const message = signedFieldNames
    .map((field) => `${field}=${paymentData[field]}`)
    .join(",");

  return crypto
    .createHmac("sha256", ESEWA_SECRET_KEY)
    .update(message)
    .digest("base64");
};


const verifySignature = (paymentData) => {
  if (
    !paymentData.signature ||
    !paymentData.signed_field_names
  ) {
    return false;
  }

  const expectedSignature =
    generateResponseSignature(paymentData);

  return expectedSignature === paymentData.signature;
};

module.exports = {
  ESEWA_PRODUCT_CODE,
  ESEWA_PAYMENT_URL,
  generateSignature,
  verifySignature,
};