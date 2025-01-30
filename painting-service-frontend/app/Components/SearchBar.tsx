"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const SearchResults: React.FC = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 bg-white shadow-md rounded-lg max-w-md w-full">
        <h2 className="text-xl font-semibold text-center">Résultats de recherche</h2>
        {query ? (
          <p className="mt-4 text-gray-600">Recherche pour: <strong>{query}</strong></p>
        ) : (
          <p className="mt-4 text-red-500">Aucun terme de recherche fourni.</p>
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
