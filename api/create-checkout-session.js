// api/create-checkout-session.js

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: "price_1QrlyXG8YammCMKoDwdlz0A6", // replace with your real Price ID
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://studio916.com/success",
      cancel_url: "https://studio916.com/cancel",
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}