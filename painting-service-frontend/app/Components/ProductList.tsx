import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string | number;
  image_url: string;
}

interface ProductListProps {
  products?: Product[]; // Rendre les produits optionnels
}

const ProductList: React.FC<ProductListProps> = ({ products: initialProducts }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Faire un fetch uniquement si products n'est pas fourni
    if (!initialProducts) {
      const fetchProducts = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/products');
          if (!response.ok) {
            throw new Error('Erreur lors de la récupération des produits');
          }
          const data: Product[] = await response.json();
          setProducts(data);
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Erreur inconnue');
          }
        }
      };

      fetchProducts();
    }
  }, [initialProducts]); // Ajout de initialProducts dans les dépendances

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto py-8">
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <p className="text-center text-gray-600">Aucun produit disponible.</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
