const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendVerificationEmail = async (email, token) => {
    // const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    const verificationUrl = `http://localhost:5000/api/auth/verify-email?token=${token}`;

    try {
        await transporter.sendMail({
            from: `"PizzaSlice 🍕" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verify your PizzaSlice account",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; background: #fff8f0; border-radius: 12px; border: 1px solid #ffe0cc;">
                    <h1 style="color: #e63946; text-align: center; margin-bottom: 8px;">🍕 PizzaSlice</h1>
                    <h2 style="color: #333; text-align: center; font-size: 20px;">Verify your email</h2>
                    <p style="color: #555; font-size: 15px; line-height: 1.5; text-align: center;">
                        Thanks for signing up! Click the button below to verify your account. This link expires in <b>15 minutes</b>.
                    </p>
                    <div style="text-align: center; margin: 28px 0;">
                        <a href="${verificationUrl}" style="background: #e63946; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">
                            Verify Email
                        </a>
                    </div>
                    <p style="color: #999; font-size: 12px; text-align: center;">
                        If you didn't create this account, you can safely ignore this email.
                    </p>
                </div>
            `,
        });
    } catch (error) {
        if (error.code === "EAUTH") {
            throw new Error(
                "Gmail login failed. Use a Google App Password for EMAIL_PASS, not your normal Gmail password.",
                { cause: error }
            );
        }
        throw error;
    }
};


const sendPasswordResetEmail = async (email, token) => {
    const resetUrl = `http://localhost:5173/reset-password?token=${token}`;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Reset your PizzaSlice password",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; background: #fff8f0; border-radius: 12px; border: 1px solid #ffe0cc;">
                <h1 style="color: #e63946; text-align: center; margin-bottom: 8px;">🍕 PizzaSlice</h1>
                <h2 style="color: #333; text-align: center; font-size: 20px;">Reset your PizzaSlice password</h2>
                <p style="color: #555; font-size: 15px; line-height: 1.5; text-align: center;">
                    This link expires in <b>15 minutes</b>.
                </p>
                <div style="text-align: center; margin: 28px 0;">
                    <a href="${resetUrl}" style="background: #e63946; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">
                        Verify Email
                    </a>
                </div>
            </div>
        `,
    });
};


module.exports = { 
    sendVerificationEmail,
    sendPasswordResetEmail,
 };