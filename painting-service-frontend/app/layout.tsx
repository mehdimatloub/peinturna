'use client';

import './globals.css';
import { CartProvider } from './Components/CartContext'; // Contexte pour le panier
import  UserProvider  from './Components/UserContext'; // Contexte pour l'utilisateur
import Cart from './Components/Cart'; // Composant du panier
import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
          <body > {/* Ajoute `className` ici */}
        <UserProvider>
          <CartProvider>
            {/* Composant pour afficher le panier */}
            <Cart />
            {/* Rendu des autres composants */}
            {children}
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
