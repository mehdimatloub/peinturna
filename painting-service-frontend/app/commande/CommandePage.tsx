'use client';

import React, { useState, useEffect } from "react"; // Ajout de useEffect pour vérifier la connexion
import SignupPage from "../signup/SignupPage"; // Formulaire d'inscription
import PaymentSelection from "../Components/PaymentSelection"; // Sélection de paiement
import { useCart } from "../Components/CartContext"; // Contexte pour gérer le panier

const CommandePage: React.FC = () => {
  const { cart, calculateTotal, removeFromCart } = useCart(); // Gestion du panier
  const [isSignupComplete, setIsSignupComplete] = useState(false); // Gère le passage vers la page de paiement
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Vérifie si l'utilisateur est connecté

  // ✅ Vérifie si l'utilisateur est connecté dès le chargement de la page
  useEffect(() => {
    const user = sessionStorage.getItem("user"); // Vérifie si l'utilisateur est stocké en session
    if (user) {
      setIsLoggedIn(true);
      setIsSignupComplete(true); // Saute directement l'inscription
    }
  }, []);

  const handleSignupSuccess = () => {
    setIsSignupComplete(true); // Passe directement au paiement après l'inscription
    setIsLoggedIn(true); // Met à jour l'état connecté
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white shadow-lg rounded-lg">
        {/* ✅ Colonne gauche : Inscription ou paiement */}
        <div className="lg:col-span-7 pr-6 border-r border-gray-300">
          {!isLoggedIn && !isSignupComplete ? (
            // ✅ Affiche le formulaire d'inscription si l'utilisateur n'est PAS connecté
            <SignupPage onSignupSuccess={handleSignupSuccess} redirectToPayment={true} />
          ) : (
            // ✅ Affiche la sélection de paiement si l'utilisateur est connecté ou après inscription
            <PaymentSelection />
          )}
        </div>

        {/* ✅ Colonne droite : Récapitulatif du panier */}
        <div className="lg:col-span-5 bg-white p-6 shadow-lg rounded-lg">
          <h2 className="text-lg font-bold text-black mb-4">Résumé de votre panier</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500">Votre panier est vide.</p>
          ) : (
            <>
              <ul className="space-y-4">
                {cart.map((item) => (
                  <li key={item.id} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={`http://localhost:5000${item.image_url}`}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="text-lg font-bold">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          {item.quantity} x {item.price.toFixed(2)} €
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <i className="fas fa-trash text-xl"></i>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <p className="text-lg font-bold">Total : {calculateTotal()} €</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandePage;
