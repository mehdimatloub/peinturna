"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const SearchResults: React.FC = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/search?query=${query}`);
        if (!response.ok) throw new Error("Erreur lors de la recherche");

        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError("Erreur lors de la récupération des résultats.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 bg-white shadow-md rounded-lg max-w-md w-full">
        <h2 className="text-xl font-semibold text-center">Résultats de recherche</h2>

        {loading ? (
          <p className="text-center text-gray-500">Chargement des résultats...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : !query ? (
          <p className="mt-4 text-red-500 text-center">Aucun terme de recherche fourni.</p>
        ) : results.length > 0 ? (
          <ul className="mt-4 text-gray-600">
            {results.map((result, index) => (
              <li key={index} className="py-2 border-b">{result.name}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-gray-500 text-center">Aucun résultat trouvé pour "{query}".</p>
        )}
      </div>
    </div>
  );
};

const SearchPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Chargement des résultats...</div>}>
      <SearchResults />
    </Suspense>
  );
};

export default SearchPage;
