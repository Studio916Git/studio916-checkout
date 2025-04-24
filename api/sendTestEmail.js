const nodemailer = require("nodemailer")
require("dotenv").config({ path: "./.env" }) // adjust path as needed

async function sendTestEmail() {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    })

    try {
        const info = await transporter.sendMail({
            from: `"Studio916 Test" <${process.env.EMAIL_USER}>`,
            to: "gian@studio-916.com",
            subject: "🚨 Test Email from Terminal",
            text: "This is a test email sent directly from the backend using your current .env settings.",
        })

        console.log("✅ Email sent:", info.response)
    } catch (error) {
        console.error("❌ Email send failed:", error.message)
    }
}

sendTestEmail()