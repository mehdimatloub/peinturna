import React, { useState } from "react";
import { loadStripe, StripeCardElement } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Remplacez par votre clé publique Stripe
const stripePromise = loadStripe("pk_test_51QlfmR2N6tm4WtHl4X2eN2saX99vxmMe3gji34oFyETJwBE1womXxxFx8Xt7fu5YpQeMVYiwJz3UJLyOYnigTtqI00tXIZH4AP");

const PaymentForm: React.FC<{ clientSecret: string; successUrl: string; cancelUrl: string }> = ({
  clientSecret,
  successUrl,
  cancelUrl,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Options de style pour le champ de carte
  const cardElementOptions = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#e5424d",
        iconColor: "#e5424d",
      },
    },
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setError("Erreur d'initialisation. Stripe n'est pas disponible.");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement) ;

    if (!cardElement) {
      setError("Erreur avec le champ de la carte.");
      setLoading(false);
      return;
    }

    try {
      // Confirmation du paiement
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) {
        console.error("Erreur de paiement :", error.message);
        setError(error.message || "Une erreur est survenue lors du paiement.");
      } else if (paymentIntent?.status === "succeeded") {
        console.log("Paiement réussi !");
        window.location.href = `${successUrl}?paymentIntent=${paymentIntent.id}`; // Redirection en cas de succès
      } else {
        setError("Le paiement n'a pas pu être confirmé. Veuillez réessayer.");
      }
    } catch (err) {
      console.error("Erreur lors du traitement du paiement :", err);
      setError("Une erreur est survenue lors du traitement du paiement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-form">
      <form onSubmit={handleSubmit}>
        <h3 className="form-header">Informations de la carte bancaire</h3>
        <div className="stripe-card-container">
          <CardElement options={cardElementOptions} />
        </div>
        {error && <div className="error-message text-red-500 mt-2">{error}</div>}
        <button
          type="submit"
          disabled={!stripe || loading}
          className={`submit-button py-2 px-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Paiement en cours..." : "Valider"}
        </button>
      </form>
    </div>
  );
};

const StripePayment: React.FC<{ clientSecret: string }> = ({ clientSecret }) => {
  // URLs de redirection après paiement
  const successUrl = "http://localhost:3000/payment/success";
  const cancelUrl = "http://localhost:3000/payment/cancel";

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm clientSecret={clientSecret} successUrl={successUrl} cancelUrl={cancelUrl} />
    </Elements>
  );
};

export default StripePayment;
