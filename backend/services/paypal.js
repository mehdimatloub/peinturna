const paypal = require('@paypal/checkout-server-sdk');

/**
 * Créer une commande PayPal
 * @param {number} amount - Montant à payer
 * @param {string} currency - Devise (par défaut: EUR)
 * @returns {Promise} - ID de commande créé
 */
const createOrder = async (amount, currency = 'EUR') => {
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: amount,
        },
      },
    ],
  });

  try {
    const response = await client.execute(request);
    return response.result;
  } catch (error) {
    console.error('Erreur lors de la création de la commande PayPal:', error);
    throw error;
  }
};

/**
 * Capturer une commande PayPal
 * @param {string} orderId - ID de la commande PayPal
 * @returns {Promise} - Résultat de la capture
 */
const captureOrder = async (orderId) => {
  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  try {
    const response = await client.execute(request);
    return response.result;
  } catch (error) {
    console.error('Erreur lors de la capture de la commande PayPal:', error);
    throw error;
  }
};
// Configuration de l'environnement PayPal
const environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  );
  const client = new paypal.core.PayPalHttpClient(environment);
  // Fonction pour obtenir l'instance du client PayPal
  const getPayPalClient = () => client;

module.exports = {
  createOrder,
  captureOrder,
  getPayPalClient
};
