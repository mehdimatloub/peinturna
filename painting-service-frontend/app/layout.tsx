'use client';

import './globals.css';
import { CartProvider } from './components/CartContext'; // Contexte pour le panier
import  UserProvider  from './components/UserContext'; // Contexte pour l'utilisateur
import Cart from './components/Cart'; // Composant du panier
import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
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
