"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
      <input
        type="text"
        placeholder="Rechercher..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 rounded-l-full outline-none"
      />
      <button type="submit" className="bg-yellow-500 px-4 py-2 rounded-r-full text-white">
        🔍
      </button>
    </form>
  );
}
