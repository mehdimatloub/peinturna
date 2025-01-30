const express = require("express");
const paypal = require("@paypal/checkout-server-sdk");
const { createPaymentIntent } = require("../services/stripe");
const db = require("../config/db");
const { getPayPalClient } = require("../services/paypal");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

/**
 * PayPal : Créer une commande
 */
router.post("/paypal/create-order", async (req, res) => {
  const { amount, currency = "EUR", userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId est requis pour créer une commande." });
  }

  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({ message: "Le montant est invalide." });
  }

  const client = getPayPalClient();
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");

  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: numericAmount.toFixed(2),
        },
      },
    ],
    application_context: {
      return_url: "http://localhost:3000/payment/success",
      cancel_url: "http://localhost:3000/payment/cancel",
    },
  });

  try {
    const order = await client.execute(request);

    const paymentData = {
      order_id: order.result.id,
      user_id: userId,
      amount: numericAmount,
      payment_method: "PayPal",
      payment_status: "pending",
      transaction_id: order.result.id,
    };

    await db.query("INSERT INTO payments SET ?", paymentData);

    const approvalUrl = order.result.links.find((link) => link.rel === "approve").href;
    res.json({ approvalUrl });
  } catch (error) {
    console.error("Erreur PayPal : ", error);
    res.status(500).json({ message: "Erreur lors de la création de la commande PayPal." });
  }
});

/**
 * PayPal : Capturer le paiement
 */
router.post("/paypal/capture-order", async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ message: "orderId est requis pour capturer le paiement." });
  }

  const client = getPayPalClient();
  const request = new paypal.orders.OrdersCaptureRequest(orderId);

  try {
    const capture = await client.execute(request);

    console.log("PayPal Capture Response:", capture.result);

    if (capture.result && capture.result.status === "COMPLETED") {
      const purchaseUnits = capture.result.purchase_units || [];
  const paymentDetails =
    purchaseUnits[0]?.payments?.captures[0] || {}; // Obtenir les détails du paiement capturé

  const amount = paymentDetails?.amount?.value || "0.00";
  const currency = paymentDetails?.amount?.currency_code || "EUR";

  await db.query(
    "UPDATE payments SET payment_status = ? WHERE transaction_id = ?",
    ["completed", orderId]
  );

  return res.json({
    success: true,
    capture: {
      id: capture.result.id,
      amount,
      currency,
    },
  });
}

     else {
      throw new Error("Échec de la capture du paiement PayPal.");
    }
  } catch (error) {
    console.error("Erreur PayPal (Capture) : ", error.message);
    res.status(500).json({ message: "Erreur lors de la capture du paiement PayPal." });
  }
});


/**
 * Stripe : Créer un PaymentIntent
 */
router.post("/stripe/create-payment-intent", async (req, res) => {
  const { amount, currency = "eur", userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId est requis pour créer un paiement Stripe." });
  }

  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({ message: "Le montant est invalide." });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(numericAmount * 100), // Stripe attend un montant en centimes
      currency,
      metadata: { userId },
    });
    

    const paymentData = {
      order_id: paymentIntent.id,
      user_id: userId,
      amount: numericAmount,
      payment_method: "Stripe",
      payment_status: "pending",
      transaction_id: paymentIntent.id,
    };

    await db.query("INSERT INTO payments SET ?", paymentData);

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Erreur Stripe : ", error);
    res.status(500).json({ message: "Erreur lors de la création du paiement Stripe." });
  }
});

/**
 * Stripe : Capturer un PaymentIntent
 */
router.post("/stripe/capture-payment-intent", async (req, res) => {
  const { paymentIntentId } = req.body;

  if (!paymentIntentId) {
    return res.status(400).json({ message: "paymentIntentId est requis pour capturer le paiement." });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      await db.query(
        "UPDATE payments SET payment_status = ? WHERE transaction_id = ?",
        ["completed", paymentIntentId]
      );
      res.json({ success: true, paymentIntent });
    } else {
      res.json({ success: false, message: "Le paiement n'a pas été confirmé." });
    }
  } catch (error) {
    console.error("Erreur lors de la validation Stripe : ", error);
    res.status(500).json({ message: "Erreur interne Stripe." });
  }
});

module.exports = router;
