'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, setUser] = useState<{ name: string, email: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    window.dispatchEvent(new Event('userUpdated'));
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {user && (
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md text-center border border-gray-200">
          
          {/* Avatar stylisé avec la couleur du bouton */}
          <div className="flex justify-center">
  <div className="w-24 h-24 flex items-center justify-center rounded-full bg-yellow-500 border-4 border-yellow-500">
    <span className="text-black font-bold text-3xl">
      {user.name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()}
    </span>
  </div>
</div>

          {/* Informations utilisateur */}
          <h1 className="text-2xl font-bold text-yellow-500 mt-4">
            Bonjour {user.name} !
          </h1>
          <p className="text-gray-700 mt-2 flex items-center justify-center space-x-2">
            📧 <span>{user.email}</span>
          </p>

          {/* Bouton de déconnexion amélioré */}
          <button
            onClick={handleLogout}
            className="mt-6 bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 shadow-md transform transition-all duration-300 hover:scale-105"
          >
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}
