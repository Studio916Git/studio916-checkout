import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "Missing sessionId" });
    }

    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);

    const totalCents = lineItems.data.reduce(
      (sum, item) => sum + item.amount_total,
      0
    );

    const total = `$${(totalCents / 100).toFixed(2)}`;

    res.status(200).json({ totalCents, total });
  } catch (error) {
    console.error("Cart total error:", error.message);
    res.status(500).json({ error: "Failed to retrieve cart total." });
  }
}