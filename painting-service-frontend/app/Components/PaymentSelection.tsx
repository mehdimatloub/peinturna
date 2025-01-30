'use client';

import React, { useState, useEffect } from "react";
import { useUser } from "../components/UserContext"; 
import { useCart } from "../components/CartContext"; 
import StripePayment from "../components/StripePayment";

const PaymentSelection: React.FC = () => {
  const { user } = useUser(); 
  const { calculateTotal } = useCart(); 
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const totalAmount = parseFloat(calculateTotal());

  // Fonction pour changer la méthode de paiement
  const handlePaymentMethodChange = (method: string) => {
    setSelectedPaymentMethod(method);
    setError(null);
  };

  // Fonction pour gérer l'acceptation des conditions générales
  const handleTermsChange = () => {
    setTermsAccepted(!termsAccepted);
    setError(null);
  };

  // Fonction pour soumettre le paiement
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedPaymentMethod) {
      setError("Veuillez sélectionner une méthode de paiement.");
      return;
    }

    if (!termsAccepted) {
      setError("Vous devez accepter les conditions générales pour continuer.");
      return;
    }

    if (!user || !user.id) {
      setError("Utilisateur non connecté. Veuillez vous inscrire ou vous connecter.");
      return;
    }

    setLoading(true);

    try {
      switch (selectedPaymentMethod) {
        case "paypal":
          await handlePayPalPayment(user.id, totalAmount);
          break;
        case "card":
          await handleCardPayment(user.id, totalAmount);
          break;
        default:
          setError("Méthode de paiement non prise en charge.");
      }
    } catch (error) {
      console.error("Erreur lors du paiement :", error);
      setError("Une erreur s'est produite lors du traitement de votre paiement.");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour gérer le paiement avec PayPal
  const handlePayPalPayment = async (userId: number, amount: number) => {
    try {
      const response = await fetch("http://localhost:5000/api/payment/paypal/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount, currency: "EUR", userId }),
      });

      const data = await response.json();
      if (data.approvalUrl) {
        window.location.href = data.approvalUrl; 
      } else {
        throw new Error("Erreur lors de la création de la commande PayPal.");
      }
    } catch (error) {
      console.error("Erreur PayPal :", error);
      setError("Erreur lors de la création de la commande PayPal.");
    }
  };

  // Fonction pour capturer un paiement PayPal
  const capturePayPalPayment = async (orderId: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/payment/paypal/capture-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await response.json();
      if (data.success) {
        setOrderDetails({
          orderId: data.capture.id,
          amount: `${data.capture.amount} ${data.capture.currency}`,
          date: new Date().toLocaleString(),
          paymentMethod: "PayPal",
          products: [
            { name: "Produit A", quantity: 1, price: `${data.capture.amount} ${data.capture.currency}` },
           ],
          }); // Exemple
      } else {
        throw new Error(data.message || "Erreur lors de la capture du paiement PayPal.");
      }
    } catch (error) {
      console.error("Erreur PayPal (Capture) :", error);
      setError("Impossible de capturer le paiement PayPal.");
    }finally{
      setLoading(false);
    }
  };

  // Fonction pour capturer un paiement Stripe
  const captureStripePayment = async (paymentIntent: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/payment/stripe/capture-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentIntentId: paymentIntent }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Paiement Stripe capturé avec succès !");
      } else {
        throw new Error("Erreur lors de la capture du paiement Stripe.");
      }
    } catch (error) {
      console.error("Erreur Stripe (Capture) :", error);
      setError("Erreur lors de la capture du paiement Stripe.");
    }
  };

  // useEffect pour capturer les paiements après redirection
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("orderId"); // PayPal
    const paymentIntent = params.get("paymentIntent"); // Stripe

    if (orderId) {
      capturePayPalPayment(orderId);
    } else if (paymentIntent) {
      captureStripePayment(paymentIntent);
    } else {
      setError("Aucun identifiant de commande fourni.");
      setLoading(false);
    }
  }, []);

  // Fonction pour gérer le paiement par carte
  const handleCardPayment = async (userId: number, amount: number) => {
    try {
      const response = await fetch("http://localhost:5000/api/payment/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency: "eur", userId }),
      });

      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret); // Stocker le clientSecret pour StripePayment
      } else {
        throw new Error("Erreur lors de la création du paiement Stripe.");
      }
    } catch (error) {
      console.error("Erreur Stripe :", error);
      setError("Erreur lors de la création du paiement Stripe.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="p-8 bg-white shadow-lg rounded-lg max-w-md w-full">
        <h2 className="text-lg font-bold mb-6 text-black text-center">Méthode de paiement</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                name="payment"
                value="paypal"
                className="form-radio h-5 w-5 text-yellow-500"
                onChange={() => handlePaymentMethodChange("paypal")}
                checked={selectedPaymentMethod === "paypal"}
              />
              <span>Payer avec PayPal</span>
            </div>
            <img src="/paypal.png" alt="PayPal" className="w-34 h-20 object-contain" />
          </label>
          <label className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                name="payment"
                value="card"
                className="form-radio h-5 w-5 text-yellow-500"
                onChange={() => handlePaymentMethodChange("card")}
                checked={selectedPaymentMethod === "card"}
              />
              <span>Payer par carte bancaire</span>
            </div>
            <div className="flex items-center gap-0"> {/* Réduction de l’espace */}
    <img src="/Mastercard.png" alt="Carte Bancaire" className="w-20 h-14 object-contain" />
    <img src="/Visa.png" alt="Carte Bancaire" className="w-20 h-14 object-contain" />
  </div>
          </label>
          <div className="mt-4 bg-blue-100 p-4 rounded-md">
            <label className="flex items-start space-x-2">
              <input
                type="checkbox"
                name="terms"
                className="form-checkbox h-5 w-5 text-yellow-500"
                onChange={handleTermsChange}
                checked={termsAccepted}
              />
              <span className="text-sm">
                J'ai lu les conditions générales de vente et j'y adhère sans réserve.
              </span>
            </label>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="text-center mt-6">
            <button
              type="submit"
              className={`mt-2 py-3 px-6 bg-yellow-500 text-white font-bold text-lg rounded-lg hover:bg-yellow-400 ${
                loading || clientSecret ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading || !!clientSecret}
            >
              {loading ? "Traitement en cours..." : "Payer la commande"}
            </button>
          </div>
        </form>
        {clientSecret && <StripePayment clientSecret={clientSecret} />}
      </div>
    </div>
  );
};

export default PaymentSelection;
function setOrderDetails(arg0: { orderId: any; amount: string; date: string; paymentMethod: string; products: { name: string; quantity: number; price: string; }[]; }) {
  throw new Error("Function not implemented.");
}

