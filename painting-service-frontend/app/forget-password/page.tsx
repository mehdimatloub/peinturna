'use client';

import React, { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setError('');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 bg-white shadow-md rounded-lg max-w-md w-full">
        <h2 className="text-xl font-semibold text-center ">Mot de passe oublié</h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <label className="block mb-2">Entrez votre e-mail :</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded focus:ring-2"
            placeholder="Votre e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="w-full mt-4 bg-blue-500 text-white py-2 rounded">
            Envoyer un lien de réinitialisation
          </button>
        </form>
        {message && <p className="text-green-500 mt-3">{message}</p>}
        {error && <p className="text-red-500 mt-3">{error}</p>}
      </div>
    </div>
  );
}
