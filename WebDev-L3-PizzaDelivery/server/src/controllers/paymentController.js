const crypto = require("crypto");
const {
    ESEWA_PRODUCT_CODE,
    ESEWA_PAYMENT_URL,
    generateSignature,
} = require("../config/esewa");

const createEsewaPyment = (req, res) => {
    try{
        const { amount } = req.body;

        if(!amount || amount <= 0){
            return res.status(400).json({
                message: "Invalid amount",
            });
        }

        const transactionUuid = `TXN-${Date.now()}`;

        const signature = generateSignature(
            amount, 
            transactionUuid
        );

        res.status(200).json({
            message: "eSewa payment created",
            payment: {
                amount: amount,
                tax_amount: 0,
                total_amount: amount,
                transaction_uuid: transactionUuid,
                product_code: ESEWA_PRODUCT_CODE,
                product_service_charge: 0,
                product_delivery_charge: 0,
                success_url: "http://localhost:5173/payment/success",
                failure_url: "http://localhost:5173/payment/failure",
                signed_field_names:
                    "total_amount,transaction_uuid,product_code",
                signature: signature,
                payment_url: ESEWA_PAYMENT_URL,
            },
        });
  
    }catch(error){
        return res.status(500).json({
            message: "Failed to create eSewa payment",
            error: error.message,
        })
    }
};


module.exports = {
    createEsewaPyment,
};