import nodemailer from "nodemailer"

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" })
    }

    const { shape, type, size, quantity, designs, quote } = req.body

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
            to: "gian@studio-916.com",
            subject: "🔥 New Custom Sticker Order Submitted",
            text: `
Hey Gian,

A new sticker order just came in. Check it out:

- Shape: ${shape || "N/A"}
- Type: ${type || "N/A"}
- Size: ${size || "N/A"}
- Quantity: ${quantity || "N/A"}
- Designs: ${designs || "N/A"}
- Quote: ${quote || "N/A"}

Get to it.
— Studio916 Notification Bot
            `.trim(),
        })
        res.status(200).json({ success: true })
    } catch (error) {
        console.error("Email error:", error)
        res.status(500).json({ success: false, error: error.message })
    }
}