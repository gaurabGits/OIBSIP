const crypto = require("crypto"); // used for generating a unique transaction ID
 
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

module.exports = {
    ESEWA_PRODUCT_CODE,
    ESEWA_PAYMENT_URL,
    generateSignature,
};