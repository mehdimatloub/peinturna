"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SearchIcon from "@mui/icons-material/Search"; // Icône MUI

export default function SearchBar() {
  const [query, setQuery] = useState(""); // État par défaut vide
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return; // Empêche une recherche vide

    router.push(`/search?query=${query}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center bg-white rounded-full shadow-md w-full">
      {/* Champ de recherche */}
      <input
        type="text"
        placeholder="Rechercher un produit"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 rounded-full outline-none pl-4"
      />
      
      {/* Bouton avec une icône sans fond jaune */}
      <button 
        type="submit" 
        className="px-3 py-2 text-gray-500 flex items-center justify-center"
      >
        <SearchIcon className="text-gray-500" />
      </button>
    </form>
  );
}
