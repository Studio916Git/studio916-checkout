import nodemailer from "nodemailer"

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" })
    }

    const { to, subject, text } = req.body

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    })

    try {
        await transporter.sendMail({
            from: `"Studio916" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
        })
        res.status(200).json({ success: true })
    } catch (error) {
        console.error("Email error:", error)
        res.status(500).json({ success: false, error: error.message })
    }
}