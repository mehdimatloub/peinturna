'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Définition du type pour l'utilisateur
interface User {
  id: number;
  name: string;
  email: string;
}

interface UserContextProps {
  user: User | null;
  login: (userData: User) => void;
  signup: (userData: User) => void; // Ajout de la méthode `signup`
  logout: () => void;
}

// Création du contexte
const UserContext = createContext<UserContextProps | undefined>(undefined);

// Fournisseur du contexte
const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Fonction pour gérer l'inscription
  const signup = (userData: User) => {
    if (userData && userData.id && userData.name && userData.email) {
      setUser(userData); // Stocke l'utilisateur dans l'état global
      localStorage.setItem('user', JSON.stringify(userData)); // Stocke l'utilisateur dans localStorage
      console.log('Utilisateur inscrit :', userData);
    } else {
      console.error('Données utilisateur invalides lors de l\'inscription :', userData);
    }
  };

  // Fonction pour gérer la connexion
  const login = (userData: User) => {
    if (userData && userData.id && userData.name && userData.email) {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('Utilisateur connecté :', userData);
    } else {
      console.error('Données utilisateur invalides lors de la connexion :', userData);
    }
  };

  // Fonction pour gérer la déconnexion
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Charger les informations utilisateur depuis le localStorage au démarrage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.id && parsedUser.name && parsedUser.email) {
          setUser(parsedUser);
        } else {
          console.error('Utilisateur non valide dans localStorage :', parsedUser);
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Erreur lors du parsing de localStorage :', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook pour utiliser le contexte utilisateur
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser doit être utilisé dans un UserProvider');
  }
  return context;
};

export default UserProvider;
