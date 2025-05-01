import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    console.log("📥 Incoming request to /api/create-checkout-session");
  
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "https://studio-916.com");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
    if (req.method === "OPTIONS") {
      console.log("🟡 Preflight OPTIONS received");
      return res.status(200).end();
    }
  
    if (req.method !== "POST") {
      console.warn(`❌ Rejected method: ${req.method}`);
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    try {
      console.log("🔄 Reading request body...");
      const parsed = req.body;
      console.log("✅ Parsed JSON body:", parsed);
  
      const { items } = parsed;
      console.log("📦 Extracted items:", items);

      // Only apply discount if items have custom price_data (not price IDs)
      const isCustomPricing = items.every(item => item.price_data?.unit_amount != null);

      const sortedItems = isCustomPricing
        ? [...items].sort((a, b) => {
            const priceA = a.price_data.unit_amount;
            const priceB = b.price_data.unit_amount;
            return priceA - priceB;
          })
        : items;

      const updatedItems = isCustomPricing && sortedItems.length >= 4
        ? sortedItems.map((item, index) => {
            if (index === 0) {
              return {
                ...item,
                price_data: {
                  ...item.price_data,
                  unit_amount: 0,
                },
              };
            }
            return item;
          })
        : items;
  
      if (!items || !Array.isArray(items) || items.length === 0) {
        console.error("❌ No items provided or invalid format");
        return res.status(400).json({ error: "No items provided" });
      }
  
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: updatedItems,
        success_url: "https://studio-916.com/thankyou",
        cancel_url: parsed.cancel_url || "https://studio-916.com/stickers",      
        // 💡 These two lines add address collection:
        shipping_address_collection: {
          allowed_countries: ['US'],
        },
        billing_address_collection: 'required',
      });
  
      console.log("✅ Stripe session created:", session.id);
      return res.status(200).json({ url: session.url });
    } catch (err) {
      console.error("🔥 Stripe session error:", err.message);
      console.error(err); // full stack trace
      return res.status(500).json({ error: err.message || "Checkout session failed." });
    }
  }

export const config = {
  api: {
    bodyParser: true,
  },
}