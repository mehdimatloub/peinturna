'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Empêche le rechargement de la page

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
          // Stocker le token pour maintenir l'authentification après redémarrage
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user)); // Pour recharger après refresh
          // Stocker temporairement l'utilisateur pour éviter un appel API supplémentaire
          sessionStorage.setItem('user', JSON.stringify(data.user));
            // Envoyer un événement personnalisé pour mettre à jour l'état dans HomePage
            window.dispatchEvent(new Event('userUpdated'));

        // Rediriger l'utilisateur vers la page de profil ou une autre page sécurisée
        router.push('/');
      } else {
        // Gérer les erreurs de connexion
        setError(data.message || 'Erreur lors de la connexion');
      }
    } catch (error) {
      console.error('Erreur lors de la requête de connexion :', error);
      setError('Erreur lors de la connexion');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white">
      <div className="w-full max-w-md bg-white shadow-md rounded px-8 py-6">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <img
            src="/logo.jpg"
            alt="Logo"
            className="h-22 w-20 object-cover rounded-full shadow-md"
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">E-mail *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Entrez votre e-mail"
              required
            />
          </div>
          <div className="mb-4 relative">
            <label className="block text-sm font-medium mb-1">Mot de passe *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Entrez votre mot de passe"
                required
              />
              <span
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-2/4 transform -translate-y-2/4 cursor-pointer text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </span>
            </div>
          </div>
          {error && (
            <div className="mb-4 text-red-500 text-sm">
              {error}
            </div>
          )}
          <div className="mb-4 text-right">
            <Link href="/forget-password" className="text-sm text-yellow-500 hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-yellow-500 text-white rounded hover:bg-yellow-400"
          >
            Me connecter
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <Link href="/signup" className="text-sm text-yellow-500 hover:underline">
            Créer mon compte
          </Link>
        </div>
      </div>
    </div>
  );
}
