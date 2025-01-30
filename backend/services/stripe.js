const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (amount, currency = 'eur') => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe utilise des centimes
      currency,
      payment_method_types: ['card'], // Ex. 'card', 'ideal' pour d'autres options
    });
    return paymentIntent.client_secret; // Renvoie le client secret au frontend
  } catch (error) {
    console.error('Erreur Stripe :', error);
    throw error;
  }
};

module.exports = {createPaymentIntent};
