'use client';

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // Pour lire les paramètres de l'URL

const PaymentSuccess: React.FC = () => {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<{
    orderId: string;
    amount: string;
    date: string;
   
  } | null>(null);

  useEffect(() => {
    // Récupération des paramètres de l'URL
    
    const paymentIntent = searchParams.get("paymentIntent"); // Stripe
    const token = searchParams.get("token"); // PayPal

    if (paymentIntent) {
      captureStripePayment(paymentIntent);
    } else if (token) {
      capturePayPalPayment(token);
    } else {
      setError("Aucun identifiant de commande fourni.");
      setLoading(false);
    }
  }, [searchParams]);

  // Fonction pour capturer un paiement PayPal
  const capturePayPalPayment = async (orderId: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/payment/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
  
      const data = await response.json();
      console.log("PayPal Capture Response:", data);
  
      if (data.success) {
        setOrderDetails({
          orderId: data.capture.id,
          amount: `${data.capture.amount} ${data.capture.currency}`,
          date: new Date().toLocaleString(),
        });
      } else {
        throw new Error(data.message || "Erreur lors de la capture du paiement PayPal.");
      }
    } catch (err) {
      console.error("Erreur PayPal :", err);
      setError("Impossible de capturer le paiement PayPal.");
    } finally {
      setLoading(false);
    }
  };
  

  // Fonction pour capturer un paiement Stripe
  const captureStripePayment = async (paymentIntentId: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/payment/stripe/capture-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId }),
      });

      const data = await response.json();
      if (data.success) {
        setOrderDetails({
          orderId: data.paymentIntent.id,
          amount: `${(data.paymentIntent.amount / 100).toFixed(2)} €`, // Stripe retourne le montant en centimes
          date: new Date().toLocaleString(),
          
        });
      } else {
        throw new Error("Erreur lors de la capture du paiement Stripe.");
      }
    } catch (error) {
      console.error("Erreur Stripe :", error);
      setError("Impossible de capturer le paiement Stripe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      {loading ? (
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-600">Traitement du paiement...</h1>
        </div>
      ) : error ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-500">Erreur</h1>
          <p className="mt-4 text-gray-600">{error}</p>
        </div>
      ) : (
        <div className="text-center bg-white shadow-lg p-6 rounded-lg">
          <h1 className="text-3xl font-bold text-green-500">Paiement Réussi !</h1>
          <p className="mt-4 text-gray-600">Votre paiement a été traité avec succès.</p>
          {orderDetails && (
            <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-md text-left">
              <h2 className="text-lg font-bold text-gray-800">Détails du Paiement</h2>
              <p className="mt-2 text-gray-600">
                <strong>Numéro de commande :</strong> {orderDetails.orderId}
              </p>
              <p className="mt-2 text-gray-600">
                <strong>Montant :</strong> {orderDetails.amount}
              </p>
              <p className="mt-2 text-gray-600">
                <strong>Date :</strong> {orderDetails.date}
              </p>
             
            </div>
          )}
          <button
            className="mt-6 px-6 py-3 bg-green-500 text-white rounded-md"
            onClick={() => (window.location.href = "/")}
          >
            Retour à l'accueil
          </button>
        </div>
      )}
    </div>
  );
}  

export default PaymentSuccess;
