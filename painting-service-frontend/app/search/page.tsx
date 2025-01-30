"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductList from "../components/ProductList"; // Réutilisation du composant

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || ""; // Récupère le terme de recherche
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]); // Correction du typage

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
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
      }
    };

    if (query) fetchProducts();
  }, [query]);

  return (
    <div className="container mx-auto py-12">
    
    {filteredProducts.length > 0 ? (
      <ProductList products={filteredProducts} />
    ) : (
      <p className="text-center text-gray-600">Aucun produit trouvé.</p>
    )}
  </div>
  );
}
