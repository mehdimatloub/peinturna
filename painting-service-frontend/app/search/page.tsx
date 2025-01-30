"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductList from "../Components/ProductList"; // Réutilisation du composant

const SearchPageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || ""; // Récupère le terme de recherche
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
        
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des produits.");
        }

        const products = await response.json();
        console.log("Produits récupérés :", products);

        // Filtrer les produits
        const filtered = products.filter((product: any) =>
          product.name?.toLowerCase().trim().includes(query.toLowerCase().trim())
        );

        console.log("Produits filtrés :", filtered);
        setFilteredProducts(filtered);
      } catch (error) {
        console.error("Erreur de récupération des produits", error);
        setError("Impossible de récupérer les produits.");
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchProducts();
  }, [query]);

  return (
    <div className="container mx-auto py-12">
      {loading ? (
        <p className="text-center text-gray-500">Chargement des produits...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : filteredProducts.length > 0 ? (
        <ProductList products={filteredProducts} />
      ) : (
        <p className="text-center text-gray-600">Aucun produit trouvé.</p>
      )}
    </div>
  );
};

const SearchPage: React.FC = () => {
  return (
    <Suspense fallback={<div className="text-center text-gray-500">Chargement de la recherche...</div>}>
      <SearchPageContent />
    </Suspense>
  );
};

export default SearchPage;
