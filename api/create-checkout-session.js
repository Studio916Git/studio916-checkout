export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "https://studio-916.com");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
    if (req.method === "OPTIONS") {
      // Preflight request
      return res.status(200).end();
    }
  
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    try {
      const buffers = []
      for await (const chunk of req) {
        buffers.push(chunk)
      }
      const rawBody = Buffer.concat(buffers).toString("utf8")
  
      let parsed
      try {
        parsed = JSON.parse(rawBody)
      } catch (jsonErr) {
        return res.status(400).json({ error: "Invalid JSON body" })
      }
  
      const { items } = parsed
  
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "No items provided" })
      }
  
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: items,
        success_url: "https://studio-916.com/success",
        cancel_url: "https://studio-916.com/cancel",
      })
  
      return res.status(200).json({ url: session.url })
    } catch (err) {
      console.error("Stripe session error:", err)
      return res.status(500).json({ error: "Checkout session failed." })
    }
  }