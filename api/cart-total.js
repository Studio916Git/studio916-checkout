export default function handler(req, res) {
    const items = [
      { amount: 400, quantity: 1 }, // $4.00
      { amount: 350, quantity: 1 }  // $3.50
    ];
  
    const totalCents = items.reduce(
      (sum, item) => sum + item.amount * item.quantity,
      0
    );
  
    const totalDollars = (totalCents / 100).toFixed(2);
  
    res.status(200).json({ total: `$${totalDollars}` });
  }