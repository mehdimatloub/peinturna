"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const PaymentCancelContent: React.FC = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("token"); // Récupérer le token s'il existe

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-500">Paiement Annulé</h1>
        {orderId && (
          <p className="mt-4 text-gray-600">
            Votre commande avec le numéro {orderId} a été annulée.
          </p>
        )}
        <button
          className="mt-6 px-6 py-3 bg-gray-500 text-white rounded-md"
          onClick={() => window.location.href = "/"} // Retourner à l'accueil
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

const PaymentCancel: React.FC = () => {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <PaymentCancelContent />
    </Suspense>
  );
};

export default PaymentCancel;
