"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const ResetPasswordContent: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams(); // ✅ Remplace l'utilisation de `window`
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // ✅ Empêche plusieurs requêtes simultanées

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setError('');
        setTimeout(() => router.push('/login'), 3000);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 bg-white shadow-md rounded-lg max-w-md w-full">
        <h2 className="text-xl font-semibold text-center">Réinitialisation du mot de passe</h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="password"
            className="w-full px-3 py-2 border rounded"
            placeholder="Nouveau mot de passe"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button 
            type="submit" 
            className="w-full mt-4 bg-blue-500 text-white py-2 rounded disabled:opacity-50"
            disabled={loading} // ✅ Désactive le bouton si en cours de chargement
          >
            {loading ? "Chargement..." : "Changer le mot de passe"}
          </button>
        </form>
        {message && <p className="text-green-500 mt-3">{message}</p>}
        {error && <p className="text-red-500 mt-3">{error}</p>}
      </div>
    </div>
  );
};

const ResetPasswordPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPasswordPage;
