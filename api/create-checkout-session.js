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
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const rawBody = Buffer.concat(buffers).toString("utf8");
      console.log("🧾 Raw body received:", rawBody);
  
      let parsed;
      try {
        parsed = JSON.parse(rawBody);
        console.log("✅ Parsed JSON body:", parsed);
      } catch (jsonErr) {
        console.error("❌ Failed to parse JSON:", jsonErr.message);
        return res.status(400).json({ error: "Invalid JSON body" });
      }
  
      const { items } = parsed;
      console.log("📦 Extracted items:", items);
  
      if (!items || !Array.isArray(items) || items.length === 0) {
        console.error("❌ No items provided or invalid format");
        return res.status(400).json({ error: "No items provided" });
      }
  
      console.log("💳 Creating Stripe checkout session...");
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: items,
        success_url: "https://studio-916.com/success",
        cancel_url: "https://studio-916.com/cancel",
      });
  
      console.log("✅ Stripe session created:", session.id);
      return res.status(200).json({ url: session.url });
    } catch (err) {
      console.error("🔥 Stripe session error:", err.message);
      console.error(err); // full stack trace
      return res.status(500).json({ error: err.message || "Checkout session failed." });
    }
  }