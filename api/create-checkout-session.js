import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let raw = "";
  req.on("data", chunk => (raw += chunk));
  req.on("end", async () => {
    try {
      const { items } = JSON.parse(raw);

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: items,
        success_url: "https://studio-916.com/success",
        cancel_url: "https://studio-916.com/cancel",
      });

      res.status(200).json({ url: session.url });
    } catch (err) {
      console.error("Checkout error:", err.message);
      res.status(500).json({ error: "Checkout session failed." });
    }
  });
}